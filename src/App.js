import MuiThemeProvider from '@mui/material/styles/ThemeProvider'
import theme from 'themes/defaultTheme'
import { AuthRoutes, UserRoutes } from './routes'
import SnacbarComponent from 'components/Snackbar/Snackbar';
import { Loader } from 'components';
import { openSnack } from 'store/reducers/snack.slice';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from 'store/reducers/user.slice';
import { useEffect } from 'react';

function App() {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('user')
    if (token) dispatch(setUser(JSON.parse(token)))
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <SnacbarComponent />
      <Loader />
      {user ? <UserRoutes /> : <AuthRoutes />}
    </MuiThemeProvider>
  );
}

export default App;
