// UserProfile.js
import React, { useEffect, useState } from 'react';
// import { UserController } from '../controllers/UserController';
// import NoteList from '../../components/NoteList';
import { useParams } from 'react-router-dom';

const ProfileView = () => {
    const [profile, setProfile] = useState({});

    // useEffect(() => {
    //     UserController.getUserData().then(setProfile);
    // }, []);

    // const handleSave = (updatedData) => {
    //     UserController.updateUserData(updatedData);
    // };

    const { username } = useParams();

    return (
        <div className='profileview'>
            
            <section className='profile_info'>
                <div>
                    <img className='profile_picture' src='https://images.unsplash.com/photo-1496360711189-5edeb09fe715?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
                    <div>
                        <h1>Astrid</h1>
                        <span className='profile_link'>mademap.web.app/<span className='username'>{username}</span></span>
                    </div>
                </div>

                <span className='community_info'>
                    <span>
                        10 followers
                    </span>
                    <span>
                        11 follows
                    </span>
                </span>

                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod officiis itaque aliquam at, quos fugit necessitatibus veritatis et consectetur illo ea id nesciunt voluptatem. Eligendi eveniet iusto at architecto eum, minus suscipit natus, ex totam quisquam reprehenderit perferendis! Atque dolorum aliquam vitae eos dolore recusandae cumque laboriosam ducimus animi assumenda et quidem velit eius possimus voluptatibus numquam nam mollitia similique, maiores fuga provident? Exercitationem aliquam culpa officiis quasi maxime adipisci eos rem, a nisi minus quisquam perspiciatis possimus quibusdam, dolore ipsam modi quidem sunt, sequi odit. Magnam placeat quia aliquid reprehenderit iste. Iste nesciunt cupiditate distinctio repellat voluptas ad illo?
                </p>

                
            </section>

            <section className='blog'>
                {/* <NoteList /> */}
            </section>

        {/* <button onClick={() => handleSave({ name: 'New Name' })}>Save</button> */}
        </div>
    );
};

export default ProfileView;
