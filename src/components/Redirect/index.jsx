import { Navigate } from 'react-router-dom';

export default function Redirect(props) {
  const toPath = props.to || '/home'
  return <Navigate to={toPath} />;
}
