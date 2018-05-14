import { types as t } from 'babel-core';
import { basename, extname } from 'path';
import template from 'babel-template';
import transformCommonjs from 'babel-plugin-transform-es2015-modules-commonjs';
import transform from './transform'

const commonVisitor = {
    ReferencedIdentifier({ node, scope  }) {
        if (node.name === 'exports' && !scope.getBinding('exports')) {
            this.hasExports = true;
        }
    },

    VariableDeclarator(path) {
        const id = path.get('id');
        if (!id.isIdentifier()) return;

        const init = path.get('init');
        if (!isValidRequireCall(init)) return;

        const source = init.node.arguments[0];
        this.sourceNames[source.value] = true;
        this.sources.push([id.node, source]);

        path.remove();
    }
};

const ymVisitor = {
    FunctionExpression : patchYm,
    ArrowFunctionExpression : patchYm
};

export default function({ types: t }) {
    return {
        inherits : transformCommonjs,
        pre() {
            // source strings
            this.sources = [];
            this.sourceNames = Object.create(null);

            this.hasExports = false;
            this.hasModule = false;
        },

        visitor : {
            Program : {
                enter(path) {
                    this.moduleName = getModuleName(path);
                },

                exit(path) {
                    path.traverse(ymVisitor, this);
                    path.traverse(commonVisitor, this);

                    transform(path, this);
                }
            }
        }
    };
}

function isValidRequireCall(path) {
    if(!path.isCallExpression()) return false;
    if(!path.get('callee').isIdentifier({ name: 'require' })) return false;
    if(path.scope.getBinding('require')) return false;

    const args = path.get('arguments');
    if(args.length !== 1) return false;

    const arg = args[0];
    if(!arg.isStringLiteral()) return false;

    if(arg.node.value.indexOf('ym:') !== 0) return false;

    return true;
}

function patchYm(path) {
    const type = getYmCallType(path);
    if(!type) return;

    const args = path.node.params.slice(type === 'define'? 1 : 0);
    const overrideTmpl = template(`VARIABLE = _extractDefaultValue(VARIABLE)`);
    const getDefTmpl = template(`
        function _extractDefaultValue(obj) {
            return obj && obj.__esModule? obj.default : obj;
        }
    `);

    if(!args.length) return;

    path.node.body.body.unshift(getDefTmpl())

    args.forEach((arg) => {
        path.node.body.body.unshift(overrideTmpl({
            VARIABLE : t.identifier(arg.name)
        }));
    })
}

function getYmCallType(path) {
    if(!path.parent) return null;

    const parent = path.parent;
    if(parent.type !== 'CallExpression') return null;

    const callee = parent.callee;
    if(!callee.object || callee.object.name !== 'modules') return null;

    // define or require
    return callee.property.name
}

function getModuleName(path) {
    const
        body = path.get('body'),
        container = body.find((p) => p.node.leadingComments);

    if(!container) { return '' };

    const
        firstComment = container.get('leadingComments.0'),
        value = firstComment.node.value,
        matches = /module\s+([\w-]+)/.exec(value);

    if(!matches) {
        throw Error('Module name reqired in header comment');
        return;
    }

    firstComment.remove();

    return matches[1];
}
