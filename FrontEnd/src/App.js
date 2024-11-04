import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Friendspost } from "./pages/Friends/Friends";
import { Form } from "./pages/form/Form";
import { Upload } from "./pages/Upload/Upload";
import { Profile } from "./pages/Profile/Profile";
import { Update } from "./pages/Update/Update";
import { Pagenotfound } from "./pages/Error/Pagenotfound";
import { Profilesaved } from "./pages/Profile/Profilesaved";
import { Profileliked } from "./pages/Profile/Profileliked";
import { PostDetails } from "./pages/PostDetails/PostDetails";
import { Loading } from "./pages/Loading/Loading";
import { Visetuser } from "./pages/Visetuser/Visetuser";




function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={Form} />
          <Route path="/Home" exact component={Home} />
          <Route path="/Friendspost" exact component={Friendspost} />
          <Route path="/Upload" exact component={Upload} />
          <Route path="/Profile" exact component={Profile} />
          <Route path="/Profile/saved" exact component={Profilesaved} />
          <Route path="/Profile/liked" exact component={Profileliked} />
          <Route path="/Update" exact component={Update} />
          {/* <Route path="/post/:postid" exact component={PostDetails} /> */}
          <Route path="/post/:postid" exact  component={(props) => <PostDetails {...props} key={window.location.pathname}/>}/>
          <Route path="/Loading/:postid" exact component={Loading} />
          {/* <Route path="/Visetuser/:userid" exact component={Visetuser} /> */}
          <Route path="/Visetuser/:userid" exact component={(props) => <Visetuser {...props} key={window.location.pathname}/>}/>

          <Route path="/" component={Pagenotfound} />

        </Switch>
      </Router>
    </>
  );
}

export default App;
