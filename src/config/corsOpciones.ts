import origenesPermitidos from './origenesPermitidos'

const corsOpciones = {
  origin: origenesPermitidos, 
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
};
  
  export default corsOpciones;