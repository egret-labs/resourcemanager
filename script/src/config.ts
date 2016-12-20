import * as ast from 'egret-typescript-ast';
import * as path from 'path';
import * as ts from 'typescript';
import { Data, ResourceConfig } from './';
import * as fs from 'fs-extra-promise';

export async function getConfigViaDecorator(egretRoot: string) {

    let decorators = await ast.findDecorator(path.join(egretRoot, "src/Main.ts"));
    decorators = decorators.filter(item => item.name == "RES.mapConfig");
    if (!decorators || decorators.length == 0 || decorators.length > 1) {
        throw new Error('missing decorator');
    }
    let decorator = decorators[0];
    let resourceConfigFileName = decorator.paramters[0];
    let typeSelector = decorator.paramters[2];
    let resourceRoot = "resource/";
    let resConfigFilePath = path.join(resourceRoot, resourceConfigFileName);
    return { resourceRoot, resourceConfigFileName, typeSelector };
}


export async function publish(filename, matcher, data) {
    let replacedText = JSON.stringify(data, null, "\t");
    let config = ResourceConfig.config;
    let content = await fs.readFileAsync(filename, "utf-8");
    let sourceFile = ts.createSourceFile(filename, content, ts.ScriptTarget.ES2015, /*setParentNodes */ true);
    content = await delint(sourceFile, matcher, replacedText);
    return content;
}


//分析特定文件中的 exports.resource = {blablabla}，将其中右侧的内容进行替换
function delint(sourceFile: ts.SourceFile, matcher: string, replacedText: string): Promise<string> {

    let config = ResourceConfig.config;

    return new Promise((reslove, reject) => {

        function delintNode(node: ts.Node) {

            // ExpressionStatement  表达式
            //    |-- BinaryExpression 二元表达式
            //      |-- left  左侧
            //      |-- right  右侧
            if (node.kind == ts.SyntaxKind.ExpressionStatement) {
                if ((node as ts.ExpressionStatement).expression.kind == ts.SyntaxKind.BinaryExpression) {
                    let expression = (node as ts.ExpressionStatement).expression as ts.BinaryExpression;
                    if (expression.left.getText() == matcher) {
                        let right = expression.right;
                        let positionStart = right.getStart();
                        let positionFinish = right.getWidth();
                        let fullText = sourceFile.getFullText();

                        fullText = fullText.substr(0, positionStart) + replacedText + fullText.substr(positionStart + positionFinish);
                        result = fullText;
                    }
                }
            }
            else {
                ts.forEachChild(node, delintNode);
            }


        }
        let result = "";
        let count = setInterval(() => {
            if (result) {
                clearInterval(count);
                reslove(result);
            }
        }, 100)
        delintNode(sourceFile);
    });


}

