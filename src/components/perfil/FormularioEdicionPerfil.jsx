import React, { useState, useEffect } from 'react';
import styles from './FormularioEdicionPerfil.module.css';
import Button from '../common/Button/Button';

/**
 * Componente para editar el perfil del usuario
 * Permite actualizar información personal como nombres, apellidos, teléfono, etc.
 */
const FormularioEdicionPerfil = ({ datosIniciales, onActualizar, loading, esAutoridad = false }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    numero_documento: '',
    cargo: '',
    area_responsabilidad: '',
    numero_empleado: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Inicializar formulario con datos del usuario
  useEffect(() => {
    if (datosIniciales) {
      console.log('Datos iniciales recibidos en FormularioEdicionPerfil:', datosIniciales);
      const nuevosDatos = {
        nombres: datosIniciales.nombres || '',
        apellidos: datosIniciales.apellidos || '',
        email: datosIniciales.email || '',
        telefono: datosIniciales.telefono || '',
        direccion: datosIniciales.direccion || datosIniciales.direccion_registro || '',
        numero_documento: datosIniciales.numero_documento || datosIniciales.documento_identidad || '',
        cargo: datosIniciales.cargo || '',
        area_responsabilidad: datosIniciales.area_responsabilidad || '',
        numero_empleado: datosIniciales.numero_empleado || ''
      };
      console.log('Datos formateados para el formulario:', nuevosDatos);
      setFormData(nuevosDatos);
    }
  }, [datosIniciales]);

  /**
   * Maneja los cambios en los campos del formulario
   * @param {Event} e - Evento del input
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Verificar si hay cambios
    if (datosIniciales) {
      const hasChanged = Object.keys(formData).some(key => {
        const newValue = key === name ? value : formData[key];
        const originalValue = datosIniciales[key] || '';
        return newValue !== originalValue;
      });
      setHasChanges(hasChanged);
    }
  };

  /**
   * Valida los datos del formulario
   * @returns {boolean} True si es válido, false si hay errores
   */
  const validateForm = () => {
    const newErrors = {};

    // Validar nombres
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son obligatorios';
    } else if (formData.nombres.trim().length < 2) {
      newErrors.nombres = 'Los nombres deben tener al menos 2 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombres)) {
      newErrors.nombres = 'Los nombres solo pueden contener letras y espacios';
    }

    // Validar apellidos
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios';
    } else if (formData.apellidos.trim().length < 2) {
      newErrors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.apellidos)) {
      newErrors.apellidos = 'Los apellidos solo pueden contener letras y espacios';
    }

    // Validar email si se proporciona
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email debe tener un formato válido';
    }

    // Validar teléfono si se proporciona
    if (formData.telefono) {
      const telefonoLimpio = formData.telefono.replace(/\D/g, '');
      if (telefonoLimpio.length !== 10) {
        newErrors.telefono = 'El teléfono debe tener exactamente 10 dígitos';
      }
    }

    // Validar número de documento si se proporciona
    if (formData.numero_documento) {
      if (formData.numero_documento.length < 6 || formData.numero_documento.length > 15) {
        newErrors.numero_documento = 'El número de documento debe tener entre 6 y 15 caracteres';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!hasChanges) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Preparar datos para envío (solo campos modificados)
      // Mapear campos del frontend al backend
      // NO incluir email ni numero_documento ya que son de solo lectura
      const camposNoEditables = ['email', 'numero_documento'];
      const datosParaActualizar = {};
      Object.keys(formData).forEach(key => {
        // Saltar campos no editables
        if (camposNoEditables.includes(key)) {
          return;
        }
        
        const newValue = formData[key].trim();
        const originalValue = (datosIniciales[key] || '').trim();
        
        if (newValue !== originalValue) {
          // Mapear nombres de campos del frontend al backend
          if (key === 'direccion') {
            datosParaActualizar.direccion_registro = newValue || null;
          } else {
            datosParaActualizar[key] = newValue || null;
          }
        }
      });

      await onActualizar(datosParaActualizar);
      setHasChanges(false);
      
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Resetea el formulario a los valores originales
   */
  const handleReset = () => {
    if (datosIniciales) {
      setFormData({
        nombres: datosIniciales.nombres || '',
        apellidos: datosIniciales.apellidos || '',
        email: datosIniciales.email || '',
        telefono: datosIniciales.telefono || '',
        direccion: datosIniciales.direccion || '',
        numero_documento: datosIniciales.numero_documento || '',
        cargo: datosIniciales.cargo || '',
        area_responsabilidad: datosIniciales.area_responsabilidad || '',
        numero_empleado: datosIniciales.numero_empleado || ''
      });
      setErrors({});
      setHasChanges(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Nombres */}
          <div className={styles.formGroup}>
            <label htmlFor="nombres" className={styles.label}>
              Nombres *
            </label>
            <input
              type="text"
              id="nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.nombres ? styles.inputError : ''}`}
              placeholder="Ingresa tus nombres"
              disabled={isSubmitting || loading}
              maxLength={50}
            />
            {errors.nombres && (
              <span className={styles.errorMessage}>{errors.nombres}</span>
            )}
          </div>

          {/* Apellidos */}
          <div className={styles.formGroup}>
            <label htmlFor="apellidos" className={styles.label}>
              Apellidos *
            </label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.apellidos ? styles.inputError : ''}`}
              placeholder="Ingresa tus apellidos"
              disabled={isSubmitting || loading}
              maxLength={50}
            />
            {errors.apellidos && (
              <span className={styles.errorMessage}>{errors.apellidos}</span>
            )}
          </div>

          {/* Email - Solo lectura */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className={`${styles.input} ${styles.inputDisabled}`}
              placeholder="correo@ejemplo.com"
              disabled={true}
              readOnly
            />
            <span className={styles.helpText}>El correo electrónico no se puede modificar</span>
          </div>

          {/* Teléfono */}
          <div className={styles.formGroup}>
            <label htmlFor="telefono" className={styles.label}>
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.telefono ? styles.inputError : ''}`}
              placeholder="3001234567"
              disabled={isSubmitting || loading}
              maxLength={10}
            />
            {errors.telefono && (
              <span className={styles.errorMessage}>{errors.telefono}</span>
            )}
          </div>

          {/* Número de documento - Solo lectura */}
          <div className={styles.formGroup}>
            <label htmlFor="numero_documento" className={styles.label}>
              Número de Documento
            </label>
            <input
              type="text"
              id="numero_documento"
              name="numero_documento"
              value={formData.numero_documento}
              className={`${styles.input} ${styles.inputDisabled}`}
              placeholder="Número de identificación"
              disabled={true}
              readOnly
              maxLength={15}
            />
            <span className={styles.helpText}>El número de documento no se puede modificar</span>
          </div>

          {/* Dirección */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="direccion" className={styles.label}>
              Dirección
            </label>
            <textarea
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className={`${styles.textarea} ${errors.direccion ? styles.inputError : ''}`}
              placeholder="Ingresa tu dirección completa"
              disabled={isSubmitting || loading}
              maxLength={200}
              rows={3}
            />
            {errors.direccion && (
              <span className={styles.errorMessage}>{errors.direccion}</span>
            )}
          </div>

          {/* Campos específicos de autoridad */}
          {esAutoridad && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="cargo" className={styles.label}>
                  Cargo
                </label>
                <input
                  type="text"
                  id="cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.cargo ? styles.inputError : ''}`}
                  placeholder="Ej: Director, Coordinador, etc."
                  disabled={isSubmitting || loading}
                  maxLength={100}
                />
                {errors.cargo && (
                  <span className={styles.errorMessage}>{errors.cargo}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="area_responsabilidad" className={styles.label}>
                  Área de Responsabilidad
                </label>
                <input
                  type="text"
                  id="area_responsabilidad"
                  name="area_responsabilidad"
                  value={formData.area_responsabilidad}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.area_responsabilidad ? styles.inputError : ''}`}
                  placeholder="Ej: Obras Públicas, Limpieza, etc."
                  disabled={isSubmitting || loading}
                  maxLength={100}
                />
                {errors.area_responsabilidad && (
                  <span className={styles.errorMessage}>{errors.area_responsabilidad}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="numero_empleado" className={styles.label}>
                  Número de Empleado
                </label>
                <input
                  type="text"
                  id="numero_empleado"
                  name="numero_empleado"
                  value={formData.numero_empleado}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.numero_empleado ? styles.inputError : ''}`}
                  placeholder="Número de empleado"
                  disabled={isSubmitting || loading}
                  maxLength={20}
                />
                {errors.numero_empleado && (
                  <span className={styles.errorMessage}>{errors.numero_empleado}</span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Botones de acción */}
        <div className={styles.formActions}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={isSubmitting || loading || !hasChanges}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || loading || !hasChanges}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                Actualizando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </div>

        {/* Información adicional */}
        <div className={styles.formInfo}>
          <p className={styles.infoText}>
            * Campos obligatorios. Los cambios se guardarán inmediatamente.
          </p>
          {hasChanges && (
            <p className={styles.changesIndicator}>
              ⚠️ Tienes cambios sin guardar
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormularioEdicionPerfil;