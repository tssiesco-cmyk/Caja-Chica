import sql from 'mssql';
// Preparado para la siguiente etapa. El repositorio demo no invoca esta conexión.
export function connectSql(){return sql.connect({server:process.env.SQL_SERVER||'localhost',database:process.env.SQL_DATABASE||'CajaChicaACHE',user:process.env.SQL_USER,password:process.env.SQL_PASSWORD,options:{encrypt:process.env.SQL_ENCRYPT!=='false',trustServerCertificate:process.env.SQL_TRUST_CERTIFICATE==='true'}})}
