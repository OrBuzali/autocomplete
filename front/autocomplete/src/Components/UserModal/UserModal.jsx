import { useRef } from "react";
import { forwardRef,useImperativeHandle } from "react";
import './UserModal.css';

const UserModal =  forwardRef(function UserModal({firstName,lastName,workTitle,createTime,imgUrl},ref) {
    const dialog = useRef();
    const imgSrc = imgUrl;
    useImperativeHandle(ref, () => {
        return {
            open() {
                dialog.current.showModal();
            }
        };
    });
    
    return (<dialog ref={dialog } className="result-modal" >
            <h2>Details Employee</h2>
            <div className="img-div-modal">
                <img 
                src={imgSrc} 
                alt="Employee image" 
                className="employee-image"
                />
            </div>
    
            <p>First name: <strong>{firstName}</strong></p>
            <p>Last name: <strong>{lastName}</strong></p>
            <p>Job title: <strong>{workTitle}</strong></p>
            <p>Start date: <strong>{createTime}</strong></p>
            <form method="dialog">
                <button>Close</button>
            </form>
    </dialog>
    );
});

export default UserModal;