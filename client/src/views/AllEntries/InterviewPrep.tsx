/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * We are focusing on React and TypeScript interview prep. Please provide specific questions that require both explanations and code examples. After each question, repost the table of contents with completed sections marked as strikethrough and my score noted. Also notate areas I need improvement. Evaluate my answers out of 10, provide feedback, and explain how I can improve my score.
 */

import React, { Component, useState, useEffect, useRef, useContext, ComponentType, Dispatch, SetStateAction, useMemo } from "react"

const myComponent = () => {
    const rest = 'but this is not'
    const myBool = true
    return (
      <div>
        This is some html {rest}
        {myBool && <p>Do more</p>}
        {myBool ? <p>Do More</p> : <p>Do less</p>}
      </div>
    )
  }
  
  const name:string = 'Adam'
  const name2 = 'Chad'
  const myArr:[number, string] = [7, 'boogers']
  const myBool:boolean = false
  const myTuple: [number, string] = [7, 'hello']
  const undefinedVar:undefined = undefined;
  const any: any = undefined
  const someFunc = (): Promise<void> => { return new Promise(() => {})}
  
  const maybe: unknown = 'Hello'
  const sayWord = (word: string|unknown) => console.log(word);
  sayWord(maybe)
  console.log(maybe)
  console.log(any)
  
  type userDetails = string | number | { name: string, age: number };
  const sayUserDetails = (props: userDetails) => console.log(props)
  interface detailsObj {
    name: string;
    age: number;
  }
  const myDetails : detailsObj = { name: 'Adam', age: 35 }
  sayUserDetails(myDetails)
  
  // Some other component:
  /** 
   * <myComponent({ name: Adam, age: 35})/>
   * 
   * 
  */
  
  interface myFCProps { name: string, age: number }
  const MyComponent: React.FC<myFCProps> = (myProps) => {
  
    const [count, setCount] = useState(35)
    const [userHasClicked, setUserHasClicked] = useState<boolean>(false)
  
    const handleClick = (): void => {
      setCount(count + 1)
      setUserHasClicked(true)
    }
    return (
      <div>
        <p>Hello {myProps.name}!</p>
        <p>You are {myProps.age} years old!</p>
        <button onClick={handleClick}> Click here to see how old you'll be next year. </button>
        { userHasClicked && <p>You will be {count} years old next year!</p> }
      </div>
    )
  };

// interface IMyClassComponentProps { name: string, age: number }
// interface IMyClassComponentState { name: 'Adam', age: 35 }

// class MyClassComponent extends Component<IMyClassComponentProps, > {
//     constructor(props: IMyClassComponentProps) {
//         super(props)
//         this.state = {
//             age: props.age,
//             name: props.name
//         }
//     }
// }

// Function Signatures

type MyFuncProps = string | boolean
/** 
 * @return {void}
 * @param {myFuncProps} props
 */
const myFunc = (props: MyFuncProps): void => console.log(props);

type AddFunction = (a:number, b:number) => number;
const add:AddFunction = (a,b) => a+b;

type SayMyNameFunc = (name:string) => void
const sayName:SayMyNameFunc = (name) => console.log(name);

const sayAllNames = (...names: string[]):void => {
    names.forEach((name) => console.log('Hello', name));
}

sayAllNames('adam', 'alex')

const concatenate = (name: string, name2: string = ''):string => {
    return name + name2
}

interface ISomeProps {
    name: string,
    age: number
}

//! Passing Props
//? Functional Component Passing Props

interface IProps { name: string, age: number};
const Component3: React.FC<IProps> = ({ name, age }) => (
    <div>Hello {name} you are {age} years old.</div>
)

const Component4 = () => (<div>
    <Component3 name='Adam' age={35} />
</div>)

//? Functional Component Passing Default Props
interface IDefaultProps {
    name: string,
    age?: number
}

const Component5: React.FC<IDefaultProps> = ({ name, age = 69 }) => (
    <div>Hello {name} you are {age} years old.</div>
)

const Component6 = () => (<div>
    <Component5 name='Adam' />
</div>)

//? Functional Component Passing Object Props
const Component7:React.FC<IProps> = (props) => {
    return (
        <div>Hello {props.name} you are {props.age} years old.</div>
    )
}

const someProps = { name: 'Adam', age: 35 }
const Component8 = () => <Component7 {...someProps} />

//! Enums
type User = { name: string, age: number }
const adam:User = { name: 'Adam', age: 35 }

//? String Enums
enum LogLevels {
  WARN = 'WARN',
  ERROR = 'ERROR',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

console.log(LogLevels.WARN)

//? Numeric Enums
enum Numbers { X, Y, Z }
enum MoreNumbers { A=69, B=adam.age } 
// enum WrongNumbers { A=69, B=adam.age, C } 
// will not work because C is a constant member (71) and it cannot come after a computed value bc adam.age might not be 70

function x (numbers:Numbers) {
  return numbers
}
console.log(x(Numbers.X))
console.log(x(Numbers.Y))
console.log(x(Numbers.Z))
console.log(MoreNumbers.A)

//! Managing State in Functional Components:
const MyStatefulComponent = () => {
  // type User = { name: string, age: number } | null
  // const [user, setUser] = useState<User>(null)
  const [count, setCount] = useState(0)
  const refCount = useRef(0)
  useEffect(() => {
    console.log('Count has changed!')
  }, [count])
  
  return <div>
    <div>Count: {count}</div>
    <div>Count That Will Not Change: {refCount.current}</div>
    <button onClick={() => setCount(count+1)}>Increment count</button>
  </div>
}

//! Managing Events in React:
const MyStatefulComponent1 = () => {
  // type User = { name: string, age: number } | null
  // const [user, setUser] = useState<User>(null)
  const [count, setCount] = useState(0)
  const refCount = useRef(0)
  useEffect(() => {
    console.log('Count has changed!')
  }, [count])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert('Form submitted!')
  }
  
  return <div>
    <div>Count: {count}</div>
    <div>Count That Will Not Change: {refCount.current}</div>
    <button onClick={() => setCount(count+1)}>Increment count</button>
    <form onSubmit={handleSubmit}>
      <button type='submit'>Special Increment Count</button>
      </form>
  </div>
}

//! useContext
const ThemeContext = useContext()

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {...children}
    </ThemeContext.Provider>
  ) 
}

const ParentComponent: React.FC = ({ children }) => {
  return (
    <div>
      <h1>This is the parent component</h1>
      <div>{children}</div> {/* This will render all nested components */}
    </div>
  );
};

const ChildComponent1: React.FC = () => <p>Child Component 1</p>;
const ChildComponent2: React.FC = () => <p>Child Component 2</p>;

const App: React.FC = () => (
  <ParentComponent>
    <ChildComponent1 />
    <ChildComponent2 />
  </ParentComponent>
);

//! uncontrolled vs controlled components
const Accordian: React.FC = () => {
  const [activePanel, setActivePanel] = useState<number>(1)
  const onShow = (panelNumber: number) => setActivePanel(panelNumber)

  return (
    <div>
      <Panel1 onShow={onShow} isActive={activePanel === 1}/>
      <Panel2 />
    </div>
  )
}

interface Panel1Props {
  onShow: (panelNumber: number) => void,
  isActive: boolean
}

const Panel1: React.FC<Panel1Props> = ({ 
  onShow,
  isActive
 }) => {
  return (

    <div>
      <button onClick={onShow(1)}>Show</button>
      { isActive && <p>Some words about Panel1</p>}
    </div>
  )
}
const Panel2: React.FC = () => {
  const [panel2IsActive, setPanel2IsActive] = useState(false)
  return (
    <div>
      { panel2IsActive && <p>Some words about panel 2</p>}
    </div>
  )
}

// EX2
const ControlledComponent: React.FC = () => {
  const [inputVal, setInputVal] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(event.target.value);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted')

  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <input type='text' onChange={handleChange} value={inputVal} />
      </label>
      <button type='submit'>Submit</button>
    </form>
  )
}

//! Generics
// Function Signature on multiple lines
type addFunc = (
  a: number, 
  b: number
) => (
  number
)
const addFunction: addFunc = (a,b) => a+b

// Functional Declaration
function identity1<T> (arg:T) { return arg }

// Arrow Function
// const identity2 = <T> (arg:T): T => { return T }

// Generic Function
function reverseArray<T> (arr: T[]) { return arr.reverse }

// Key value pairs
interface KeyValuePair<K, V> { key: K, value: V }
function getKVP <K, V> (key: K, value: V): KeyValuePair<K, V> {
  return { key, value }
}

// Class EX
class Storage<T> {
  private items: T[] = []

  addItem (item: T):void {
    this.items.push(item)
  }

  getItem (index: number): T { return this.items[index] } 
}

function mergeObjects <O1, O2> (object1: O1, object2: O2): O1 & O2 {
  return { ...object1, ...object2 }
}

function createArray <T = string> (arrLen: number, val: T = 'A' as T): T[] {
  return new Array(arrLen).fill(val)
}

//! Conditional Rendering
interface IStatusMessageProps { isOnline: boolean }
const StatusMessage: React.FC<IStatusMessageProps> = (props: IStatusMessageProps) => {
  if (props.isOnline) return <p>User is online.</p>
  return <></>
}

interface IUserGreetingProps { isLoggedIn: boolean }
const UserGreeting: React.FC<IUserGreetingProps> = (props) => {
  return props.isLoggedIn 
  ? <p>Welcome Back User</p>
  : <p>Please Log in</p>
}

const Notifications2: React.FC<{ notifications: string[] }> = ({ notifications }) => {
  return (
    <>
      {notifications.length > 0 && (
        <div>You have {notifications.length} notifications</div>
      )}
    </>
  );
};

const Notification: React.FC<{ notifications: string[] }> = ({ notifications }): JSX.Element => {
  return (
    <>
    {notifications.length > 0 && (
      <div>You have {notifications.length} notifications </div>
    )}
    </>
  )
}

const Dashboard: React.FC<{ isLoggedIn: boolean, messages: string[] }> = ({ isLoggedIn, messages }) => {
  if (isLoggedIn) return <p>Please Log in</p>
  return (
    <div>
      <p>Welcome Back</p>
      {messages.length > 0 && (
        <p>You have {messages.length} messages.</p>
      )}
    </div>
  )
}

//! HOCs
// EX1:
function withLogger<T>(WrappedComponent: ComponentType<T>) {
  return (props: T) => {
    useEffect(() => {
      console.log('Component mounted')
    }, [])

    return <WrappedComponent {...props} />
  }
}

const HelloWorld: React.FC = () => <p>Hello World!</p>
const EnhancedHelloWorld = withLogger(HelloWorld)

//! TS Classes

interface IStorage<T> {
  items: T[]
  addItem(item: T): void;
  getItems(): T[]
}

class Storage2<T> implements IStorage<T> {
  items: T[];

  constructor(items: T[]) {
    this.items = items;
  }

  addItem = (item: T) => {
    this.items.push(item)
  }

  getItems = () => this.items
}

class Book {
  public title: string;
  public author: string;
  public pages: number

  constructor(title: string, author: string, pages: number) {
    this.title = title;
    this.author = author
    this.pages = pages
  }

  read(): void { console.log(`Reading ${this.title} by ${this.author}`) }
}

class BankAccount {
  public accountNumber: number;
  private balance: number

  constructor(accountNumber: number, balance: number) {
    this.accountNumber = accountNumber
    this.balance = balance;
  }

  deposit (amount: number) { this.balance += amount }
  withdraw (amount: number) { 
    this.balance -= amount;
  }
  getBalance = () => this.balance;
}

class SavingsAccount extends BankAccount {
  protected interestRate: number;
  
  constructor(interestRate: number, balance: number, accountNumber: number) {
    super(accountNumber, balance)
    this.interestRate = interestRate;
  }

  addInterest = () => this.deposit(this.getBalance() * this.interestRate)
}

interface IPair<K,V> {
  key: K;
  value: V
}

class Pair<K,V> implements IPair<K,V> {
  public key: K;
  public value: V

  constructor(key: K, value: V) {
    this.key = key,
    this.value = value
  }

  getKey = () => this.key
  getValue = () => this.value
}

//! Render Props
// EX1
const Counter: React.FC<{ render: (count: number) => JSX.Element}> = ({ render }) => {
  const [count, setCount] = useState(0)

  return render(count)
}

const ChildComponent3: React.FC<{ count: number}> = ({ count }) => {
  return <p>The count is {count}</p>
}

const App1 = () => (
  <div>
    <Counter render={(count) => <ChildComponent3 count={count} /> } />
  </div>
) 

// EX2
interface IFetchDataParent { render: (data: unknown) => JSX.Element }

const FetchDataParent: React.FC<IFetchDataParent> = ({ render }) => {
  const data = new Promise((resolve, _reject) => {
    setTimeout(() => resolve(true), 1000);
  })
  return render(data)
}

const FetchDataChild: React.FC<{ data: unknown }> = ({ data }) => {
  return <p>Found this data {data}</p>
}

const App2 = () => (
  <div>
    <FetchDataParent render={(data) => <FetchDataChild data={data} />} />
  </div>
)

// EX3
const FormParent: React.FC<{ render: (setInputValue: Dispatch<SetStateAction<string>>, inputValue: string) => JSX.Element }> = ({ render }) => {
  const [inputValue, setInputValue] = useState('')
  let input = useRef('')
  useEffect(() => { 
    input.current = (inputValue) 
  }, [inputValue])

  return render(setInputValue, inputValue)
}

const FormChild: React.FC<{ setInputValue: Dispatch<SetStateAction<string>>, inputValue: string }> = ({ setInputValue, inputValue }) => {
  return <form>
    <label>
      <input type='text' value={inputValue} onChange={(e) => {
        e.preventDefault();
        setInputValue(e.target.value)
      }} />
    </label>
  </form>
}

const App3 = () => {
  <FormParent render={(setInputValue, inputValue) => <FormChild setInputValue={setInputValue} inputValue={inputValue} /> } />
}

//! React Performance
const ExpensiveComponent:React.FC<{ a: number, b: number }> = ({ a, b }) => {
  const expensiveValue = useMemo(() => a * b * 101000000000, [a, b]);
  return <p>This is a big number {expensiveValue} </p>
}

//! Installing TS in a project
// npm install --save-dev typescript @types/node
// npx tsc --init

//? Basic config:
/** {
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
 */

//? Setting up React:
// npx create-react-app my-react-app --template typescript

//! Strict mode
// Enforces class properties to be typed within the class
// `this` keyword needs to be explicitly typed
// variables are not allowed to be undefined or null without being typed as such

//! Namespaces 
// are like Rails modules for JS
namespace MyNamespace {
  export const greeting = (name: string) => `Hello ${name}`
  export interface User { name: string }
}

const user: MyNamespace.User = { name: 'Adam '}
console.log(MyNamespace.greeting(user.name))

//! Union Types
let value: number | string
value = 'hello'
value = 7

//! Intersection Type
interface A { propA: string }
interface B { propB: number }
type AB = A & B
const example: AB = { propA: 'A', propB: 7 }

// EX
type inputType = string | number
const process = (input: inputType) => {
 if (typeof input === 'string') return input.toUpperCase()
  return input.toFixed(2).toString();
}

//! Type Guards
function isString (value: unknown): value is string {
  return typeof value === 'string';
}

//! Type Assertions