import { createContext,useContext,useState } from "react";
import { useEffect } from "react";
const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    //user obj that contains attributes such as role
    const [user,setUser] = useState(null);
    //token for a user
    const [token,setToken]=useState(null);
 
    //so data is not lost on reload
    //get user and token from localStorage each render or refresh
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedToken) setToken(savedToken);
        }, []);

    //login function
    const login = (userData,authToken=null) => {
        setUser(userData);
        setToken(authToken);

         if (authToken) {
      localStorage.setItem("token", authToken);
    }

    localStorage.setItem("user", JSON.stringify(userData));
    }

    //when logging out , remove token and user from session
     const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );


};

export const useAuth = () => useContext(AuthContext);