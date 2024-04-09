import Header from 'components/Header';
import Main from 'components/Main';
import Footer from 'components/Footer';

function App() {
  return (
    <div className="grid min-h-full grid-cols-1 grid-rows-[auto_1fr_auto] bg-teal-800 text-teal-50">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
