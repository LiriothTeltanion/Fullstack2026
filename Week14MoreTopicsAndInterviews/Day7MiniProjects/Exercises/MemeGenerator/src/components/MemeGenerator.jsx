import { Component } from "react";
import MemeForm from "./MemeForm.jsx";
import MemePreview from "./MemePreview.jsx";

const MEMES_URL = "https://api.imgflip.com/get_memes";

export default class MemeGenerator extends Component {
  state = {
    topText: "When the code works",
    bottomText: "on the first try",
    randomImage: "https://i.imgflip.com/1bij.jpg",
    name: "One Does Not Simply",
    fontSize: 40,
    color: "#ffffff",
    allMemeImgs: [],
    loading: true,
    error: "",
    imageError: "",
  };

  componentDidMount() {
    const controller = new AbortController();
    this.controller = controller;
    fetch(MEMES_URL, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error("Could not load meme templates.");
        return response.json();
      })
      .then(data => {
        if (controller.signal.aborted) return;
        const templates = data?.data?.memes;
        if (!data?.success || !Array.isArray(templates)) {
          throw new Error("The meme API returned invalid templates.");
        }
        const usable = templates.filter(
          template => typeof template?.url === "string" && template.url.startsWith("https://")
        );
        if (!usable.length) throw new Error("No meme templates are available.");
        // Keep the required initial image until the user presses Gen.
        this.setState({ allMemeImgs: usable, loading: false, error: "" });
      })
      .catch(error => {
        if (!controller.signal.aborted) {
          this.setState({
            loading: false,
            error: error.message || "Could not load meme templates.",
          });
        }
      });
  }

  componentWillUnmount() {
    this.controller?.abort();
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: name === "fontSize" ? Number(value) : value });
  };

  pickRandomImage = () => {
    const { allMemeImgs } = this.state;
    if (!allMemeImgs.length) return;
    const random = allMemeImgs[Math.floor(Math.random() * allMemeImgs.length)];
    this.setState({ randomImage: random.url, name: random.name || "Meme", imageError: "" });
  };

  render() {
    return (
      <>
        <MemeForm
          meme={this.state}
          onChange={this.handleChange}
          onRandom={this.pickRandomImage}
          disabled={!this.state.allMemeImgs.length}
        />
        <div className="preview-panel">
          <p role="status">{this.state.loading ? "Loading templates…" : ""}</p>
          {this.state.error && (
            <p className="error" role="alert">
              {this.state.error} You can still edit the initial meme.
            </p>
          )}
          {this.state.imageError && (
            <p className="error" role="alert">
              {this.state.imageError}
            </p>
          )}
          <MemePreview
            meme={this.state}
            onImageError={() =>
              this.setState({
                imageError:
                  "The image could not be loaded. Check your connection or generate another meme.",
              })
            }
          />
        </div>
      </>
    );
  }
}
