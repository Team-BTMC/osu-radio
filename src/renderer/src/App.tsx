import type { JSX } from 'solid-js';
import Gradient from './components/Gradient';
import image from './assets/hololive IDOL PROJECT - BLUE CLAPPER_2761277.jpg';
import { createSignal, onMount } from 'solid-js';

export default function App(): JSX.Element {
    const [topColor, setTopColor] = createSignal("dodgerblue");

    onMount(() => {
        window.addEventListener("click", () => {
            setTopColor("teal");
        });
    });

    window.api.listen("log", (...args) => {
        console.log(args);
        return new Promise((resolve) => {
            setTimeout(() => resolve("poggers"), 500);
        });
    });

    return (
        <Gradient bottomColor="crimson" topColor={topColor()}>
            <div class="app">
                <nav>
                    <button class="icon">Aa</button>
                    <button class="icon">Aa</button>
                    <button class="icon">Aa</button>
                    <button class="icon">Aa</button>
                    <button class="icon">Aa</button>
                </nav>

                <div class="side-pane">
                    <div class="search">
                        <h1>Search...</h1>
                    </div>

                    <div class="list">
                        <div class="item">
                            <img src={image} alt="art" />
                            <div class="column">
                                <h3>BLUE CLAPPER</h3>
                                <span>hololive IDOL PROJECT</span>
                            </div>
                        </div>
                        <div class="item">
                            <img src={image} alt="art" />
                            <div class="column">
                                <h3>BLUE CLAPPER</h3>
                                <span>hololive IDOL PROJECT</span>
                            </div>
                        </div>
                        <div class="item">
                            <img src={image} alt="art" />
                            <div class="column">
                                <h3>BLUE CLAPPER</h3>
                                <span>hololive IDOL PROJECT</span>
                            </div>
                        </div>
                        <div class="item">
                            <img src={image} alt="art" />
                            <div class="column">
                                <h3>BLUE CLAPPER</h3>
                                <span>hololive IDOL PROJECT</span>
                            </div>
                        </div>
                        <div class="item">
                            <img src={image} alt="art" />
                            <div class="column">
                                <h3>BLUE CLAPPER</h3>
                                <span>hololive IDOL PROJECT</span>
                            </div>
                        </div>
                        <div class="item">
                            <img src={image} alt="art" />
                            <div class="column">
                                <h3>BLUE CLAPPER</h3>
                                <span>hololive IDOL PROJECT</span>
                            </div>
                        </div>
                        <div class="item">
                            <img src={image} alt="art" />
                            <div class="column">
                                <h3>BLUE CLAPPER</h3>
                                <span>hololive IDOL PROJECT</span>
                            </div>
                        </div>
                        <div class="item">
                            <img src={image} alt="art" />
                            <div class="column">
                                <h3>BLUE CLAPPER</h3>
                                <span>hololive IDOL PROJECT</span>
                            </div>
                        </div>
                        <div class="item">
                            <img src={image} alt="art" />
                            <div class="column">
                                <h3>BLUE CLAPPER</h3>
                                <span>hololive IDOL PROJECT</span>
                            </div>
                        </div>
                        <div class="item">
                            <img src={image} alt="art" />
                            <div class="column">
                                <h3>BLUE CLAPPER</h3>
                                <span>hololive IDOL PROJECT</span>
                            </div>
                        </div>
                        <div class="item">
                            <img src={image} alt="art" />
                            <div class="column">
                                <h3>BLUE CLAPPER</h3>
                                <span>hololive IDOL PROJECT</span>
                            </div>
                        </div>
                        <div class="item">
                            <img src={image} alt="art" />
                            <div class="column">
                                <h3>BLUE CLAPPER</h3>
                                <span>hololive IDOL PROJECT</span>
                            </div>
                        </div>
                        <div class="item">
                            <img src={image} alt="art" />
                            <div class="column">
                                <h3>BLUE CLAPPER</h3>
                                <span>hololive IDOL PROJECT</span>
                            </div>
                        </div>
                    </div>
                </div>

                <main class="center">
                    <div class="container">
                        <div class="song">
                            <img src={image} alt="art" />
                            <h3>BLUE CLAPPER</h3>
                            <span>hololive IDOL PROJECT</span>
                        </div>

                        <div class="seeker">
                            <div class="bar">
                                <div class="filling"></div>
                            </div>
                            <div class="time">
                                <span class="currently">0:01:09</span><span class="duration">0:04:20</span>
                            </div>
                        </div>

                        <div class="controls">
                            <div class="wrapper">
                                <button class="icon"><span>||</span></button>
                                <button class="icon"><span>|&lt;</span></button>
                                <button class="icon"><span>&gt;|</span></button>
                                <div class="dropdown">
                                    <button class="icon"><span>Vol</span></button>
                                    <div class="menu">
                                        <div class="menu-wrapper">
                                            <div class="selectors local">
                                                <span>Local</span>
                                                <div class="bar vertical">
                                                    <div class="filling"></div>
                                                </div>
                                            </div>

                                            <div class="selectors global">
                                                <span>Global</span>
                                                <div class="bar vertical">
                                                    <div class="filling"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </Gradient>
    );
}
