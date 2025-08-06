const AdminHeader = () => (

    <div className="row align-items-center">
        <div className="col-sm-6 col-12 mb-4 mb-sm-0">
            <h1 className="h2 mb-0 ls-tight">Admin Dashboard</h1>
        </div>
        <div className="col-sm-6 col-12 text-sm-end">
            {/* <div className="mx-n1">
                <a className="btn d-inline-flex btn-sm btn-neutral border-base mx-1" onClick={() => toast.info("Pencil Button Clicked")}>
                    <span className="pe-2">
                        <i className="bi bi-pencil"></i>
                    </span>
                    <span>Edit</span>
                </a>
                <a className="btn d-inline-flex btn-sm btn-primary mx-1" onClick={() => toast.info("Plus Button Clicked")}>
                    <span className="pe-2">
                        <i className="bi bi-plus"></i>
                    </span>
                    <span>Create</span>
                </a>
            </div> */}
        </div>
    </div>
);

export default AdminHeader;