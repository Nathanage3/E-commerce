import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import routes from './routes.jsx';
import ScrollToTop from './utils/scrollToTop.js';

function App() {
  return (
    <Layout>
      <ScrollToTop /> 
      <Routes>
        {routes.map((route, index) =>
          route.children ? (
            <Route key={index} path={route.path} element={route.element}>
              {route.children.map((child, childIndex) => (
                <Route key={childIndex} {...child} />
              ))}
            </Route>
          ) : (
            <Route key={index} {...route} />
          )
        )}
      </Routes>
    </Layout>
  );
}

export default App;
