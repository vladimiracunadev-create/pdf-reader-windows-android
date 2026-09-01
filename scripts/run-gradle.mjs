import {spawn} from 'node:child_process';

const tasks=process.argv.slice(2);
if(!tasks.length){console.error('Indica al menos una tarea Gradle.');process.exit(2);}

const windows=process.platform==='win32';
const command=windows?(process.env.ComSpec||'cmd.exe'):'./gradlew';
const args=windows?['/d','/s','/c','gradlew.bat',...tasks]:tasks;
const child=spawn(command,args,{cwd:'android',stdio:'inherit'});
child.on('error',error=>{console.error(`No se pudo iniciar ${command}: ${error.message}`);process.exit(1);});
child.on('exit',(code,signal)=>{if(signal){console.error(`Gradle terminó por señal ${signal}.`);process.exit(1);}process.exit(code??1);});
