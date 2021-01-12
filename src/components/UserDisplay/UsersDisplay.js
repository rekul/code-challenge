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
        <button onClick={()=>props.handleDelete(props.data.id)}>Delete User</button>
    </div>
}

const UsersDisplay = props => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [pageInfo, setPageInfo] = useState(null); // how many pages etc
    const [userIDToDelete, setUserIDToDelete] = useState(null); //are you sure popup
    const [search, setSearch] = useState('');// this search only looks at current page - probably should search all users

    const [errorMessage, setErrorMessage] = useState('');

    const userToDelete = userIDToDelete === null ? null : users.filter(user => user.id === userIDToDelete)[0];

    //array of hidden user ids - since delete in our API doesn't actually do anything on delete except send back 204
    //NOTE this is done purely to make the UI work for demo purposes - in the real world I would call out that the API doesn't work as expected. 
    const [hiddenUsers, setHiddenUsers] = useState([]);

    const getUsers = () => {
        props.API.getUsers(page, (res)=>{
            // console.log('data', data)
            if(res.status !== 200){
                setErrorMessage('Error: cannot find users.');
                return;
            }
            setUsers(res.data.data);
            setPageInfo({
                total_pages:res.data.total_pages,
            })
        })
    }
    const deleteUser = (userID) => {
        props.API.deleteUser(userID, (res) => {
            //expect 204
            if(res.status === 204){
                // console.log('success', res)
                setUserIDToDelete(null)
                setHiddenUsers([...hiddenUsers, userID])
            }else{
                console.error('delete user failure', res)
                setUserIDToDelete(null)
                setErrorMessage('Error: failed to delete user.');
            }
        })
    }

    const onSearchChange = (e) => {
        setSearch(e.currentTarget.value);
    }

    useEffect(()=>{
        getUsers();
    }, [page])

    return (
        <div className={`UsersDisplay`}>
            <h2>Users from API:</h2>

            {/* refresh button, as instructed */}
            <button onClick={getUsers}>Refresh User Data</button>

            {/* search bar */}
            <input type="text" val={search} onChange={onSearchChange} placeholder={'Search Users'}/>

            {errorMessage && <div className={`error`} style={{color:"red"}}>
                <p>
                    {errorMessage}
                </p>
            <button onClick={()=>setErrorMessage('')}>OK</button>
            </div>}

            {
                //loop through users make cards
                Array.isArray(users) &&
                <div className="users">
                    {users.filter(user => {
                        //search filter
                        if(!search) return true;
                        return (
                            Object.values(user).filter(val => 
                                typeof val === 'string' && val.toLowerCase().trim().includes(search.toLowerCase().trim())
                                ).length > 0
                        )
                    }).filter(user => {
                        //hidden users filter - again, this is just so 'delete' works in this demo visually with the API that doesn't do anything on 'successful' delete. If I had an API team to cry to I would.
                        return !hiddenUsers.includes(user.id)
                    }).map(user => {
                        //render the card
                        return <UserCard 
                        key={`user-card-${page}-${user.id}`} 
                        handleDelete={setUserIDToDelete}
                        data={user}/>
                    })}
                </div>
            }
            {pageInfo && <nav className={`pagination`}>
                {(()=>{
                    //iife to generate page nav
                    let jsx = [];
                    for(let i = 1; i <= pageInfo.total_pages; i++){
                        if(page === i){
                            jsx.push(
                                <span key={`page-select-${i}-no-button`}>{i}</span>
                            )
                        }else{
                            jsx.push(
                                <button key={`page-select-${i}`} onClick={()=>setPage(i)}>{i}</button>
                            )
                        }
                    }
                    return jsx;
                })()}
            </nav>}

            {userIDToDelete && <div className={`modal`}>
                <div className={`scrim`}></div>
                <div className={`body`}>
                    <p>
                        {`Are you sure you want to delete user ${userToDelete.first_name} ${userToDelete.last_name}?`}
                    </p>

                    <div className={`actions`}>
                        <button onClick={()=>{deleteUser(userIDToDelete)}}>Yes</button>
                        <button onClick={()=>{setUserIDToDelete(null)}}>No</button>

                    </div>

                </div>
               
            </div>}
        </div>
    )
}

export default UsersDisplay