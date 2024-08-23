import { JSEncrypt } from 'jsencrypt';
import NodeRsa from 'node-rsa'
export async function encryptDataWithPublicKey(data:any) {
    // const encryptor = new JSEncrypt();

    // encryptor.setPublicKey(publicKey);

    // const encrypted = encryptor.encrypt('hello world');
    // console.log(encrypted)

    // if (!encrypted) {
    //     throw new Error('Encryption failed');
    // }
    
    // return encrypted;
    const key = new NodeRsa().importKey(await fetchPublicKey(),'public');
    return key.encrypt(data,'base64');

}
export async function fetchPublicKey(){
    return await fetch("/public-key").then(r=>r.text())
}
//Usa o agente e a memoria para saber se é o dispositivo
export function getDeviceIndentifier() {
    const fingerprint = {
        userAgent:navigator.userAgent,
        timeZone:getTimeZone(),
        WegGl:getWebGLFingerprint()
    }
    return fingerprint
}
//Funções para pegar as coisas do digest
//mais facil pra debugar
function getWebGLFingerprint() {
    try {
        let canvas = document.createElement('canvas');
        let gl = canvas.getContext('webgl') as WebGLRenderingContext || canvas.getContext('experimental-webgl') as WebGLRenderingContext;

        if (!gl) return null;

        let debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            let vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            let renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            return { vendor, renderer };
        }

        return null
    } catch (e) {
        return null;
    }
}
function getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

