import origenesPermitidos from './origenesPermitidos'

const corsOpciones: any = {
    origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
      console.log(origin);
      if (origenesPermitidos.some((origenesPermitidos) => origenesPermitidos === origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por cors'));
      }
    },
    optionsSuccessStatus: 200,
  };
  
  export default corsOpciones;