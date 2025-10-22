-- Tabla para registrar las cancelaciones de reservas
CREATE TABLE IF NOT EXISTS log_cancelaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT NOT NULL,
    usuario_id INT NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    fecha_cancelacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reserva_id (reserva_id),
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_fecha_cancelacion (fecha_cancelacion)
);

-- Agregar columna estado a la tabla reservas si no existe
ALTER TABLE reservas 
ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'confirmada',
ADD COLUMN IF NOT EXISTS fecha_cancelacion TIMESTAMP NULL;

-- Crear índice para la columna estado
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);
