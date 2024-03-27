const Cconsole = {
    log(...args:any[]):void{
        console.log(`[${new Date(Date.now()).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}]:`, ...args);
    },
    error(...args:any[]):void{
        console.error(`[ERROR:${new Date(Date.now()).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}]:`, ...args);
    }
}
export default Cconsole