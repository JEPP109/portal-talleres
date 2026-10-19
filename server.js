const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
// Servir la carpeta estática "public" (donde está nuestro HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Base de datos (Simulación con persistencia en memoria/servidor)
let talleres = [
  {
    id: 1,
    categoria: 'Programación',
    titulo: 'Introducción a Python',
    fecha: '20 oct. 2026',
    horario: '09:00 - 11:00',
    duracion: '2 horas',
    instructor: 'Carlos Ramos',
    lugar: 'Lab 201 - Edificio A',
    modalidad: 'Presencial',
    costo: 'Gratuito',
    descripcion: 'Aprende las bases fundamentales de la programación con Python desde cero.',
    requisitos: 'Trae tu computador portátil.',
    cuposDisponibles: 12,
    capacidadTotal: 25,
    destacado: 'Disponible'
  },
  {
    id: 2,
    categoria: 'Diseño',
    titulo: 'Diseño de interfaces UX/UI',
    fecha: '21 oct. 2026',
    horario: '14:00 - 17:00',
    duracion: '3 horas',
    instructor: 'Laura Méndez',
    lugar: 'Sala de diseño. Edificio 3',
    modalidad: 'Presencial',
    costo: 'Gratuito',
    descripcion: 'Aprende a transformar una idea en una interfaz clara y usable. Explora los fundamentos de UX y construye tu primer prototipo.',
    requisitos: 'Trae tu identificación estudiantil, cuaderno y tu computador portátil. Llega 10 minutos antes.',
    cuposDisponibles: 3,
    capacidadTotal: 20,
    destacado: 'Pocos cupos'
  },
  {
    id: 3,
    categoria: 'Emprendimiento',
    titulo: 'De la idea al emprendimiento',
    fecha: '22 oct. 2026',
    horario: '10:00 - 12:00',
    duracion: '2 horas',
    instructor: 'Roberto Díaz',
    lugar: 'Auditorio Principal',
    modalidad: 'Presencial',
    costo: 'Gratuito',
    descripcion: 'Descubre los pasos esenciales para validar tu modelo de negocio e iniciar tu proyecto.',
    requisitos: 'Trae cuaderno y lapicero para las dinámicas.',
    cuposDisponibles: 0,
    capacidadTotal: 20,
    destacado: 'Sin cupos'
  },
  {
    id: 4,
    categoria: 'Idiomas',
    titulo: 'Inglés conversacional',
    fecha: '23 oct. 2026',
    horario: '16:00 - 18:00',
    duracion: '2 horas',
    instructor: 'Ana Martínez',
    lugar: 'Aula 104 - Edificio B',
    modalidad: 'Presencial',
    costo: 'Gratuito',
    descripcion: 'Mejora tu fluidez y pronunciación en inglés a través de dinámicas de conversación grupales.',
    requisitos: 'Nivel básico-intermedio recomendable.',
    cuposDisponibles: 7,
    capacidadTotal: 20,
    destacado: 'Disponible'
  },
  {
    id: 5,
    categoria: 'Programación',
    titulo: 'Desarrollo web con React',
    fecha: '26 oct. 2026',
    horario: '14:00 - 17:00',
    duracion: '3 horas',
    instructor: 'Miguel Ángel',
    lugar: 'Lab 302 - Edificio A',
    modalidad: 'Presencial',
    costo: 'Gratuito',
    descripcion: 'Construye aplicaciones web modernas con React y JavaScript.',
    requisitos: 'Conocimientos básicos de HTML, CSS y JS.',
    cuposDisponibles: 8,
    capacidadTotal: 25,
    destacado: 'Disponible'
  },
  {
    id: 6,
    categoria: 'Diseño',
    titulo: 'Fotografía y composición',
    fecha: '27 oct. 2026',
    horario: '09:00 - 12:00',
    duracion: '3 horas',
    instructor: 'Sofia Torres',
    lugar: 'Estudio de foto',
    modalidad: 'Presencial',
    costo: 'Gratuito',
    descripcion: 'Técnicas de encuadre, iluminación y composición visual para proyectos creativos.',
    requisitos: 'Cámara réflex o teléfono móvil con cámara de buena resolución.',
    cuposDisponibles: 2,
    capacidadTotal: 15,
    destacado: 'Pocos cupos'
  }
];

// Tabla de inscripciones en BD
let inscripciones = [];

// ==========================================
// RUTAS DE LA API (ENDPOINTS)
// ==========================================

// 1. Obtener todos los talleres
app.get('/api/talleres', (req, res) => {
  res.json(talleres);
});

// 2. Obtener un taller por ID
app.get('/api/talleres/:id', (req, res) => {
  const taller = talleres.find(t => t.id === parseInt(req.params.id));
  if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
  res.json(taller);
});

// 3. Crear una nueva inscripción (Resta 1 cupo)
app.post('/api/inscribir', (req, res) => {
  const { tallerId, nombre, codigo, correo } = req.body;

  const taller = talleres.find(t => t.id === parseInt(tallerId));

  if (!taller) {
    return res.status(404).json({ ok: false, mensaje: 'El taller no existe' });
  }

  if (taller.cuposDisponibles <= 0) {
    return res.status(400).json({ ok: false, mensaje: 'No quedan cupos disponibles' });
  }

  // Generar código de reserva único ej: TAL-2026-8B0F3237
  const codigoReserva = `TAL-2026-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  // Restar 1 cupo en la base de datos
  taller.cuposDisponibles -= 1;
  if (taller.cuposDisponibles === 0) {
    taller.destacado = 'Sin cupos';
  } else if (taller.cuposDisponibles <= 3) {
    taller.destacado = 'Pocos cupos';
  }

  const nuevaInscripcion = {
    id: inscripciones.length + 1,
    codigoReserva,
    tallerId: taller.id,
    tallerTitulo: taller.titulo,
    tallerCategoria: taller.categoria,
    tallerFecha: taller.fecha,
    tallerHorario: taller.horario,
    tallerInstructor: taller.instructor,
    tallerLugar: taller.lugar,
    nombreEstudiante: nombre,
    codigoEstudiante: codigo,
    correoEstudiante: correo,
    estado: 'activa',
    fechaRegistro: new Date()
  };

  inscripciones.push(nuevaInscripcion);

  res.json({
    ok: true,
    mensaje: 'Inscripción realizada con éxito',
    inscripcion: nuevaInscripcion,
    cuposRestantes: taller.cuposDisponibles
  });
});

// 4. Cancelar inscripción (Suma 1 cupo de regreso)
app.post('/api/cancelar', (req, res) => {
  const { codigoReserva } = req.body;

  const inscripcion = inscripciones.find(i => i.codigoReserva === codigoReserva);

  if (!inscripcion) {
    return res.status(404).json({ ok: false, mensaje: 'Inscripción no encontrada' });
  }

  if (inscripcion.estado === 'cancelada') {
    return res.status(400).json({ ok: false, mensaje: 'Esta inscripción ya fue cancelada' });
  }

  // Cambiar estado
  inscripcion.estado = 'cancelada';

  // Devolver el cupo al taller
  const taller = talleres.find(t => t.id === inscripcion.tallerId);
  if (taller) {
    taller.cuposDisponibles += 1;
    if (taller.cuposDisponibles > 3) {
      taller.destacado = 'Disponible';
    } else if (taller.cuposDisponibles > 0) {
      taller.destacado = 'Pocos cupos';
    }
  }

  res.json({
    ok: true,
    mensaje: 'Inscripción cancelada correctamente',
    codigoReserva
  });
});

// 5. Obtener inscripciones de un alumno (por correo o código)
app.get('/api/mis-talleres', (req, res) => {
  const { correo } = req.query;
  if (!correo) {
    return res.json(inscripciones);
  }
  const misInscripciones = inscripciones.filter(i => i.correoEstudiante.toLowerCase() === correo.toLowerCase());
  res.json(misInscripciones);
});

// Ruta secreta para ver todos los inscritos
app.get('/api/admin/inscritos', (req, res) => {
  res.json({
    totalInscripciones: inscripciones.length,
    inscripciones: inscripciones
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});