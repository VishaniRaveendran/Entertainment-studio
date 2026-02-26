import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Movies from "./Pages/Movies/Movies";
import Search from "./Pages/Search/Search";
import Series from "./Pages/Series/Series";
import Trending from "./Pages/Trending/Trending";
import MyList from "./Pages/MyList/MyList";
import Detail from "./Pages/Detail/Detail";
import Person from "./Pages/Person/Person";
import Collection from "./Pages/Collection/Collection";
import Genre from "./Pages/Genre/Genre";

function App() {
  return (
    <BrowserRouter>
      <div className="appLayout">
        <Sidebar />
        <div className="appContent">
          <Header />
          <main className="app">
            <Switch>
              <Route path="/" component={Trending} exact />
              <Route path="/movies" component={Movies} />
              <Route path="/series" component={Series} />
              <Route path="/search" component={Search} />
              <Route path="/mylist" component={MyList} />
              <Route path="/movie/:id" render={({ match }) => <Detail mediaType="movie" id={match.params.id} />} />
              <Route path="/tv/:id" render={({ match }) => <Detail mediaType="tv" id={match.params.id} />} />
              <Route path="/person/:id" component={Person} />
              <Route path="/collection/:id" component={Collection} />
              <Route path="/movies/genre/:genreId" component={Genre} />
              <Route path="/series/genre/:genreId" component={Genre} />
            </Switch>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
