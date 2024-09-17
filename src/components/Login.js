import { signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

// const Login = ({ setIsAuth }) => {
//   const navigate = useNavigate();

//   // const handleSubmit = async (e) => {
//   // e.preventDefault();
//   const handleSubmit = () => {
//     signInWithEmailAndPassword(auth, loginEmail, loginPassword)
//       .then(() => {
//         localStorage.setItem("isAuth", true);
//         setIsAuth(true);
//         navigate("/");
//       })
//       .catch((error) => {
//         alert("メールアドレスまたはパスワードが間違っています");
//       });
//   };

/* ↓ログインを判定する設定 */
// const [user, setUser] = useState();

// useEffect(() => {
//   onAuthStateChanged(auth, (currentUser) => {
//     setUser(currentUser);
//   });
// });

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const loginInwithGoogle = () => {
    //Googleでログイン
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
      navigate("/");
    });
  };

  return (
    <div>
      <p>ログインして始める</p>
      <button onClick={loginInwithGoogle}>Googleでログイン</button>
    </div>
  );
};
//   return (
//     <Container maxWidth="xs">
//       <Box
//         sx={{
//           marginTop: 8,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <Typography component="h1" variant="h4">
//           ログイン
//         </Typography>

//         <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="email"
//             label="メールアドレス"
//             name="email"
//             autoComplete="email"
//             autoFocus
//             value={loginEmail}
//             onChange={(e) => setLoginEmail(e.target.value)}
//           />

//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="password"
//             label="パスワード"
//             type="password"
//             id="password"
//             autoComplete="current-password"
//             value={loginPassword}
//             onChange={(e) => setLoginPassword(e.target.value)}
//           />

//           <Button
//             onClick="/creatememo"
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3, mb: 2 }}
//           >
//             ログイン
//           </Button>

//           <Grid container>
//             {/* <Grid item xs>
//               <Link href="#" variant="body2">
//                 パスワードを忘れた
//               </Link>
//             </Grid> */}
//             <Grid item>
//               <Navigate to="/register" variant="body2">
//                 新規登録
//               </Navigate>
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

export default Login;
