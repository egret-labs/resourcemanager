import * as plugin from './';
import * as path from 'path';
import * as crc32 from 'crc32';

const p: plugin.Plugin = {
    name: "convertFileName",
    onFile: async (file) => {
        if (!file.isExistedInResourceFolder) {
            return file;
        }
        let crc32_file_path: string = crc32(file.contents);
        // crc32_file_path = `${crc32_file_path.substr(0, 2)}/${crc32_file_path.substr(2)}${file.extname}`;
        let origin_path = file.origin;
        crc32_file_path = origin_path.substr(0, origin_path.length - file.extname.length) + "_" + crc32_file_path + file.extname;
        file.path = path.join(file.base, crc32_file_path);
        return file;
    },
    onFinish: () => {

    }
}
export default p;