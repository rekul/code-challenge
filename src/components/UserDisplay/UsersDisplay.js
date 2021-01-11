import React, {useState, useEffect} from 'react'
import './UsersDisplay.css'


const UserCard = (props) => {
    return <div className={`UserCard`}>
        <img src={props.data.avatar} alt={`avatar for ${props.data.first_name} ${props.data.last_name}`}/>
        <p>
            {`${props.data.first_name} ${props.data.last_name}`}
        </p>
        <p>
            <a href={`mailto:${props.data.email}`}>{props.data.email}</a>
        </p>
    </div>
}

const UsersDisplay = props => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [pageInfo, setPageInfo] = useState(null);

    const getUsers = () => {
        props.API.getUsers(page, (data)=>{
            console.log('data', data)
            setUsers(data.data);
        })
    }

    useEffect(()=>{
        getUsers();
    }, [page])

    return (
        <div className={`UsersDisplay`}>
            <h2>Users from API:</h2>
            {
                Array.isArray(users) &&
                <div class="users">
                    {users.map((user, userIndex) => {
                        return <UserCard data={user}/>
                    })}
                </div>
            }
        </div>
    )
}

export default UsersDisplay