import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import fs from 'fs';

export const verificarToken = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      fs.appendFileSync('logs/unauthorized.log', `Unauthorized access attempt: ${new Date().toISOString()}\n`);
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    // Extraer token (formato: "Bearer TOKEN")
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      fs.appendFileSync('logs/unauthorized.log', `Invalid token format: ${new Date().toISOString()}\n`);
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido'
      });
    }

    // Verificar y decodificar token
    const decoded = jwt.verify(token, jwtConfig.secret, { algorithms: ['HS256'] });
    
    // Agregar datos del usuario a la petición
    req.usuario = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      fs.appendFileSync('logs/unauthorized.log', `Expired token: ${new Date().toISOString()}\n`);
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    fs.appendFileSync('logs/unauthorized.log', `Token verification error: ${error.message} - ${new Date().toISOString()}\n`);
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};
