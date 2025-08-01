
const StatsCard = ({ title, value, icon, iconBg, change, changeDirection, changeText }) => {
    const changeClass = changeDirection === 'up' ? 'bg-soft-success text-success' : 'bg-soft-danger text-danger';
    const changeIcon = changeDirection === 'up' ? 'bi-arrow-up' : 'bi-arrow-down';

    return (
        <div className="col-xl-3 col-sm-6 col-12">
            <div className="card shadow border-0">
                <div className="card-body">
                    <div className="row">
                        <div className="col">
                            <span className="h6 font-semibold text-muted text-sm d-block mb-2">{title}</span>
                            <span className="h3 font-bold mb-0">{value}</span>
                        </div>
                        <div className="col-auto">
                            <div className={`icon icon-shape ${iconBg} text-white text-lg rounded-circle`}>
                                <i className={`bi ${icon}`}></i>
                            </div>
                        </div>
                    </div>
                    {/* <div className="mt-2 mb-0 text-sm">
                        <span className={`badge badge-pill ${changeClass} me-2`}>
                            <i className={`bi ${changeIcon} me-1`}></i>{change}
                        </span>
                        <span className="text-nowrap text-xs text-muted">{changeText}</span>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;