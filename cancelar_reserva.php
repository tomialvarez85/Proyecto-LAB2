<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Método no permitido'
    ]);
    exit();
}

// Incluir conexión a la base de datos
require_once 'db.php';

try {
    // Obtener datos del POST
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Datos JSON inválidos');
    }
    
    // Validar campos obligatorios
    if (!isset($input['usuario_id']) || !isset($input['reserva_id'])) {
        throw new Exception('Faltan campos obligatorios: usuario_id y reserva_id');
    }
    
    $usuario_id = intval($input['usuario_id']);
    $reserva_id = intval($input['reserva_id']);
    
    if ($usuario_id <= 0 || $reserva_id <= 0) {
        throw new Exception('IDs inválidos');
    }
    
    // Verificar que el usuario existe y obtener sus datos
    $stmt = $pdo->prepare("SELECT id, admin FROM usuarios WHERE id = ?");
    $stmt->execute([$usuario_id]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$usuario) {
        throw new Exception('Usuario no encontrado');
    }
    
    // Verificar que la reserva existe
    $stmt = $pdo->prepare("SELECT id, usuario_id, fecha, hora, cancha_id FROM reservas WHERE id = ?");
    $stmt->execute([$reserva_id]);
    $reserva = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$reserva) {
        throw new Exception('Reserva no encontrada');
    }
    
    // Validar permisos de cancelación
    $puede_cancelar = false;
    $motivo = '';
    
    if ($usuario['admin'] == '1') {
        // Administrador puede cancelar cualquier reserva
        $puede_cancelar = true;
        $motivo = 'Administrador cancelando reserva';
    } elseif ($reserva['usuario_id'] == $usuario_id) {
        // Usuario normal solo puede cancelar sus propias reservas
        $puede_cancelar = true;
        $motivo = 'Usuario cancelando su propia reserva';
    } else {
        $puede_cancelar = false;
        $motivo = 'No tienes permisos para cancelar esta reserva';
    }
    
    if (!$puede_cancelar) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => $motivo
        ]);
        exit();
    }
    
    // Verificar si la reserva ya fue cancelada
    $stmt = $pdo->prepare("SELECT estado FROM reservas WHERE id = ?");
    $stmt->execute([$reserva_id]);
    $estado_actual = $stmt->fetchColumn();
    
    if ($estado_actual === 'cancelada') {
        throw new Exception('Esta reserva ya fue cancelada anteriormente');
    }
    
    // Iniciar transacción
    $pdo->beginTransaction();
    
    try {
        // Actualizar el estado de la reserva a 'cancelada'
        $stmt = $pdo->prepare("UPDATE reservas SET estado = 'cancelada', fecha_cancelacion = NOW() WHERE id = ?");
        $stmt->execute([$reserva_id]);
        
        // Registrar la cancelación en un log (opcional)
        $stmt = $pdo->prepare("
            INSERT INTO log_cancelaciones (reserva_id, usuario_id, motivo, fecha_cancelacion) 
            VALUES (?, ?, ?, NOW())
        ");
        $stmt->execute([$reserva_id, $usuario_id, $motivo]);
        
        // Confirmar transacción
        $pdo->commit();
        
        // Respuesta exitosa
        echo json_encode([
            'status' => 'ok',
            'message' => 'Reserva cancelada exitosamente',
            'data' => [
                'reserva_id' => $reserva_id,
                'fecha_cancelacion' => date('Y-m-d H:i:s'),
                'cancelado_por' => $usuario['admin'] == '1' ? 'administrador' : 'usuario'
            ]
        ]);
        
    } catch (Exception $e) {
        // Rollback en caso de error
        $pdo->rollBack();
        throw $e;
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error de base de datos: ' . $e->getMessage()
    ]);
}
?>
