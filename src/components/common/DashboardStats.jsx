import { useState, useMemo } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import StatsCard from './StatsCard';
import './DashboardStats.css';

/**
 * Componente de Dashboard con estadísticas y gráficos
 * @param {Object} props
 * @param {Array} props.denuncias - Array de denuncias para calcular estadísticas
 */
const DashboardStats = ({ denuncias = [] }) => {

    // Calcular estadísticas generales
    const stats = useMemo(() => {
        const total = denuncias.length;
        const pendientes = denuncias.filter(d => d.estado === 'pendiente').length;
        const enProceso = denuncias.filter(d => d.estado === 'en_proceso').length;
        const resueltas = denuncias.filter(d => d.estado === 'resuelta').length;

        const porcentajeResueltas = total > 0 ? ((resueltas / total) * 100).toFixed(1) : 0;

        return {
            total,
            pendientes,
            enProceso,
            resueltas,
            porcentajeResueltas
        };
    }, [denuncias]);

    // Datos para gráfico de barras por categoría
    const categoriaData = useMemo(() => {
        const categorias = {};

        denuncias.forEach(d => {
            const cat = d.categoria || 'Otros';
            categorias[cat] = (categorias[cat] || 0) + 1;
        });

        return Object.entries(categorias).map(([nombre, cantidad]) => ({
            nombre,
            cantidad
        }));
    }, [denuncias]);

    // Datos para gráfico de líneas por mes
    const mesData = useMemo(() => {
        const meses = {};
        const mesesNombres = [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ];

        denuncias.forEach(d => {
            if (d.fecha_creacion) {
                const fecha = new Date(d.fecha_creacion);
                const mes = mesesNombres[fecha.getMonth()];
                meses[mes] = (meses[mes] || 0) + 1;
            }
        });

        return mesesNombres.map(mes => ({
            mes,
            denuncias: meses[mes] || 0
        })).filter(m => m.denuncias > 0);
    }, [denuncias]);

    // Datos para gráfico de pie (estados)
    const estadoData = useMemo(() => {
        return [
            { nombre: 'Pendientes', valor: stats.pendientes, color: '#f59e0b' },
            { nombre: 'En Proceso', valor: stats.enProceso, color: '#8b5cf6' },
            { nombre: 'Resueltas', valor: stats.resueltas, color: '#10b981' }
        ].filter(item => item.valor > 0);
    }, [stats]);

    return (
        <div className="dashboard-stats">
            {/* Cards de estadísticas generales */}
            <div className="stats-grid">
                <StatsCard
                    title="Total Denuncias"
                    value={stats.total}
                    icon="📊"
                    color="blue"
                    trend={12}
                    trendLabel="vs mes anterior"
                />
                <StatsCard
                    title="Pendientes"
                    value={stats.pendientes}
                    icon="⏳"
                    color="yellow"
                    trend={-5}
                    trendLabel="vs semana anterior"
                />
                <StatsCard
                    title="En Proceso"
                    value={stats.enProceso}
                    icon="🔄"
                    color="purple"
                    trend={8}
                    trendLabel="en proceso ahora"
                />
                <StatsCard
                    title="Resueltas"
                    value={stats.resueltas}
                    icon="✅"
                    color="green"
                    trend={15}
                    trendLabel="este mes"
                />
            </div>

            {/* Gráficos */}
            <div className="charts-grid">
                {/* Gráfico de Barras - Denuncias por Categoría */}
                {categoriaData.length > 0 && (
                    <div className="chart-container">
                        <h3 className="chart-title">Denuncias por Categoría</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoriaData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis
                                    dataKey="nombre"
                                    stroke="var(--text-secondary)"
                                    style={{ fontSize: '0.875rem' }}
                                />
                                <YAxis
                                    stroke="var(--text-secondary)"
                                    style={{ fontSize: '0.875rem' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--bg-secondary)',
                                        border: '2px solid var(--border-color)',
                                        borderRadius: '8px',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                                <Legend
                                    wrapperStyle={{
                                        fontSize: '0.875rem',
                                        color: 'var(--text-secondary)'
                                    }}
                                />
                                <Bar
                                    dataKey="cantidad"
                                    fill="#3b82f6"
                                    radius={[8, 8, 0, 0]}
                                    name="Denuncias"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Gráfico de Líneas - Denuncias por Mes */}
                {mesData.length > 0 && (
                    <div className="chart-container">
                        <h3 className="chart-title">Tendencia Mensual</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={mesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis
                                    dataKey="mes"
                                    stroke="var(--text-secondary)"
                                    style={{ fontSize: '0.875rem' }}
                                />
                                <YAxis
                                    stroke="var(--text-secondary)"
                                    style={{ fontSize: '0.875rem' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--bg-secondary)',
                                        border: '2px solid var(--border-color)',
                                        borderRadius: '8px',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                                <Legend
                                    wrapperStyle={{
                                        fontSize: '0.875rem',
                                        color: 'var(--text-secondary)'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="denuncias"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10b981', r: 6 }}
                                    activeDot={{ r: 8 }}
                                    name="Denuncias"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Porcentaje de resolución */}
            <div className="resolution-percentage">
                <div className="percentage-card">
                    <h3 className="percentage-title">Tasa de Resolución</h3>
                    <div className="percentage-value">
                        {stats.porcentajeResueltas}%
                    </div>
                    <div className="percentage-bar">
                        <div
                            className="percentage-fill"
                            style={{ width: `${stats.porcentajeResueltas}%` }}
                        />
                    </div>
                    <p className="percentage-label">
                        {stats.resueltas} de {stats.total} denuncias resueltas
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
