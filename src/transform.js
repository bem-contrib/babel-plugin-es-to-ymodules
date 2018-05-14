import { types as t } from 'babel-core';

export default function(program, { hasExports, sources, moduleName }) {
    let prevDecl = null,
        deps = sources.map(source => {
            const
                localName = source[0].name,
                importName = source[1].value.replace('ym:', ''),
                isPrevDecl = moduleName === importName;

            isPrevDecl && (prevDecl = localName);

            return { localName, importName, isPrevDecl };
        });

    const
        body = program.node.body,
        ymArgs = [],
        ymBodyArgNames = [];

    if(deps.length) {
        deps = deps
            .filter(({ isPrevDecl }) => !hasExports || !isPrevDecl)
            .map(d => {
                ymBodyArgNames.push(t.identifier(d.localName));
                return t.stringLiteral(d.importName);
            });

        deps.length && ymArgs.push(t.arrayExpression(deps));
    }

    if(!(deps.length || hasExports)) return;

    if(hasExports) {
        if(!moduleName)
            throw program.buildCodeFrameError('Module name required');

        ymArgs.unshift(t.stringLiteral(moduleName));
        ymBodyArgNames.unshift(t.identifier('provide'));

        prevDecl && ymBodyArgNames.push(t.identifier(prevDecl));

        program.get('body.0').scope.push(t.variableDeclarator(
            t.identifier('exports'),
            t.objectExpression([])
        ));

        program.node.body.push(t.expressionStatement(t.callExpression(
            t.identifier('provide'),
            [t.identifier('exports')]
        )));
    }

    ymArgs.push(t.functionExpression(
        null,
        ymBodyArgNames,
        t.blockStatement(program.node.body)
    ));

    var call = t.callExpression(
        t.memberExpression(
            t.identifier('modules'),
            t.identifier(hasExports? 'define' : 'require'),
            false
        ),
        ymArgs);

    program.node.body = [t.expressionStatement(call)];
}
