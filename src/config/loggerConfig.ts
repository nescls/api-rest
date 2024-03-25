import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Configuración del registrador de errores (nivel más alto para capturar todos los errores)
const errorLogger = winston.createLogger({
  level: 'error', // Capturar todos los errores (error y warn)
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Marca de tiempo con formato personalizado
    winston.format.errors({ stack: true }),
  ),
  transports: [
    new DailyRotateFile({
      filename: 'errors-%DATE%.log', // Archivo separado para errores con prefijo
      dirname: 'storage/logs', // Directorio para guardar los archivos de registro
      datePattern: 'YYYY-MM-DD', // Patrón de rotación diaria
      maxSize: '20m', // Tamaño máximo del archivo (opcional)
      maxFiles: '14', // Número máximo de archivos de registro archivados (opcional)
    }),
  ],
});

// Configuración del registrador de información (nivel inferior para mensajes informativos)
const infoLogger = winston.createLogger({
  level: "info", // Nivel de registro (predeterminado info)
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Marca de tiempo con formato personalizado
    winston.format.json() // Salida en formato JSON
  ),
  transports: [
    new DailyRotateFile({
      filename: 'info-%DATE%.log', // Archivo separado para mensajes informativos con prefijo
      dirname: 'storage/logs', // Directorio para guardar los archivos de registro
      datePattern: 'YYYY-MM-DD', // Patrón de rotación diaria
      maxSize: '20m', // Tamaño máximo del archivo (opcional)
      maxFiles: '14', // Número máximo de archivos de registro archivados (opcional)
    }),
  ],
});

export { errorLogger, infoLogger };
