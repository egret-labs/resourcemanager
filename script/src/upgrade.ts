// import * as egret_project from '../egret-project';
// import * as Config from '../Config';
// import * as path from 'path';
// import * as fs from 'fs-extra-promise';

// import * as resource from './';




// export async function run(env) {



//     async function copyLibrary() {
//         let folder = await Config.getConfig("egret-libs-folder");
//         let source = path.join(folder, "resourcemanager", "bin");
//         let target = path.join(env.egretProjectPath, "bin");
//         await fs.copyAsync(source, target);
//     }







//     async function convertEgretProperties() {
//         let propertyData = await egret_project.getEgretProjectConfig(env);
//         delete propertyData.modules['res'];

//         for (let m of propertyData.modules) {
//             if (m.name == "res") {
//                 m.name = "resourcemanager";
//                 m.path = "."
//             }
//         }
//         await egret_project.updateProjectConfig(env);
//     }

//     await convertEgretProperties();
//     await copyLibrary();

// }

