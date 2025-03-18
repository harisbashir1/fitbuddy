import { Link } from 'react-router-dom';

const Profile = () => {
  
    return (
      <div>
        <header>
          <nav>
            <ul>
              <li><Link to="/Dashboard">Home</Link></li>
              <li><Link to="/UserProfile">Profile</Link></li>
            </ul>
          </nav>
        </header>
      </div>
    );
    };
    
    export default Profile;