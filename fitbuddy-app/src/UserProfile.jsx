import { Link } from 'react-router-dom';

const Profile = () => {
  
    return (
      <div>
        <header>
          <nav>
            <ul>
              <li><Link to="/Dashboard">Home</Link></li>
              <li><Link to="/Friends">Friends</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <h1>Profile</h1>
          <h2>Here users can manage their goals and account settings</h2>
        </main>
      </div>
    );
    };
    
    export default Profile;