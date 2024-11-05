import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
      <Router>
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Friendspost" element={<Friendspost />} />
          <Route path="/Upload" element={<Upload />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Profile/saved" element={<Profilesaved />} />
          <Route path="/Profile/liked" element={<Profileliked />} />
          <Route path="/Update" element={<Update />} />
          <Route path="/post/:postid" element={<PostDetails key={window.location.pathname} />} />
          <Route path="/Loading/:postid" element={<Loading />} />
          <Route path="/Visetuser/:userid" element={<Visetuser key={window.location.pathname} />} />
          <Route path="*" element={<Pagenotfound />} />
        </Routes>
      </Router>
  );
}

export default App;
