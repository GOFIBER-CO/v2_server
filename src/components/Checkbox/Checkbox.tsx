const Checkbox = ({ isCheck }: { isCheck?: boolean }) => {
    return (
        <>
            {isCheck ? (
                <span className="deploy_checkbox_checkmark">
                    <i className="fa fa-check"></i>
                </span>
            ) : (
                ''
            )}
        </>
    )
}

export default Checkbox
