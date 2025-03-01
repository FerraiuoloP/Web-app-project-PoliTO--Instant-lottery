
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from '../context/UserContext';
import PropTypes from "prop-types";

export const Allowed = {
  Any: 'Any',
  LoggedIn: 'LoggedIn',
  LoggedOut: 'LoggedOut'
};

//The ProtectedRoute component is a wrapper for the routes that need to be protected
const ProtectedRoute = ({ children, allow }) => {
  const { isLoggedIn, loginChecked } = useUser();

  if (!loginChecked) {
    return <div>Loading user...</div>
  }
  if (!isLoggedIn && allow === Allowed.LoggedIn) {
    return <Navigate to="/" />;
  }
  if (isLoggedIn && allow === Allowed.LoggedOut) {
    return <Navigate to="/lottery" />;
  }
  else
    return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allow: PropTypes.oneOf(Object.values(Allowed)).isRequired
};


export default ProtectedRoute;
