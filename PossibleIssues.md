**Auth handling**

In 'AuthContext.js', the details of a logged in user are captured by the firebase method 'onAuthStateChanged',
and then set to global state:


    export const AuthContext = createContext();

        export const AuthProvider = ({children}) => {

            const [user,setUser] = useState(null);

            useEffect(() => {
                onAuthStateChanged(auth,(user) => {
                    setUser(user);
                })
            },[])

            return (
                <AuthContext.Provider value={{user}}>
                    {children}
                </AuthContext.Provider>
            )

        }

In components where logged-in user details are required, user information
is extracted as follows:

  const { user } = useContext(AuthContext);

Not sure if this is the best way to handle auth state?


