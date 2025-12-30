import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import './StatsCard.css';

/**
 * Tarjeta de estadística individual
 * @param {Object} props
 * @param {string} props.title - Título de la métrica
 * @param {number} props.value - Valor de la métrica
 * @param {string} props.icon - Emoji del icono
 * @param {string} props.color - Color temático (blue, green, yellow, red)
 * @param {number} props.trend - Tendencia en porcentaje (opcional)
 * @param {string} props.trendLabel - Label de la tendencia (opcional)
 */
const StatsCard = ({
    title,
    value,
    icon,
    color = 'blue',
    trend,
    trendLabel
}) => {
    const getTrendIcon = () => {
        if (trend === undefined || trend === null) return null;

        if (trend > 0) {
            return <TrendingUp size={16} className="trend-icon trend-up" />;
        } else if (trend < 0) {
            return <TrendingDown size={16} className="trend-icon trend-down" />;
        }
        return null;
    };

    const formatValue = (val) => {
        if (typeof val === 'number') {
            return val.toLocaleString('es-ES');
        }
        return val;
    };

    return (
        <div className={`stats-card stats-card-${color}`}>
            <div className="stats-card-header">
                <div className="stats-card-icon">
                    {icon}
                </div>
                <div className="stats-card-info">
                    <h3 className="stats-card-title">{title}</h3>
                    <p className="stats-card-value">{formatValue(value)}</p>
                </div>
            </div>

            {(trend !== undefined && trend !== null) && (
                <div className="stats-card-footer">
                    <div className="stats-card-trend">
                        {getTrendIcon()}
                        <span className={trend >= 0 ? 'trend-positive' : 'trend-negative'}>
                            {Math.abs(trend)}%
                        </span>
                    </div>
                    {trendLabel && (
                        <span className="stats-card-trend-label">{trendLabel}</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default StatsCard;
