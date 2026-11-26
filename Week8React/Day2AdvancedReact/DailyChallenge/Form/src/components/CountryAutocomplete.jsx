import { Component, createRef } from "react";
import { countries, filterCountries } from "../countries.js";

/** An editable combobox: focus stays in the input while arrows move the option. */
class CountryAutocomplete extends Component {
  state = { query: "", open: false, activeIndex: -1, selected: "", cleared: false };
  input = createRef();
  list = createRef();

  componentDidUpdate(_previousProps, previousState) {
    if (this.state.open && previousState.activeIndex !== this.state.activeIndex) {
      // Scroll the list itself, never the page, when a keyboard option is offscreen.
      const option = this.list.current?.children[this.state.activeIndex];
      const list = this.list.current;
      if (option && list) {
        if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
        if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
          list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
        }
      }
    }
  }

  getSuggestions = () => filterCountries(this.state.query, this.props.countries ?? countries);

  handleChange = event => {
    const query = event.target.value;
    this.setState({
      query,
      open: Boolean(query.trim()),
      activeIndex: -1,
      selected: "",
      cleared: false,
    });
  };

  selectCountry = country => {
    this.setState({ query: country, selected: country, open: false, activeIndex: -1 });
  };

  handleKeyDown = event => {
    if (event.nativeEvent.isComposing) return;
    const suggestions = this.getSuggestions();
    const { open, activeIndex } = this.state;
    if (event.key === "Escape") {
      this.setState({ open: false, activeIndex: -1 });
    } else if (suggestions.length && ["ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      const next =
        !open || activeIndex === -1
          ? event.key === "ArrowDown"
            ? 0
            : suggestions.length - 1
          : (activeIndex + (event.key === "ArrowDown" ? 1 : -1) + suggestions.length) %
            suggestions.length;
      this.setState({ open: true, activeIndex: next });
    } else if (open && suggestions.length && ["Home", "End"].includes(event.key)) {
      event.preventDefault();
      this.setState({ activeIndex: event.key === "Home" ? 0 : suggestions.length - 1 });
    } else if (event.key === "Enter" && open && activeIndex >= 0) {
      event.preventDefault();
      this.selectCountry(suggestions[activeIndex]);
    }
  };

  clear = () => {
    this.setState({ query: "", selected: "", open: false, activeIndex: -1, cleared: true });
    this.input.current?.focus();
  };

  render() {
    const { query, open, activeIndex, selected, cleared } = this.state;
    const suggestions = this.getSuggestions();
    const expanded = open && suggestions.length > 0;
    return (
      <section
        className="card country-picker"
        aria-labelledby="country-heading"
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget))
            this.setState({ open: false, activeIndex: -1 });
        }}
      >
        <p className="eyebrow">Class component · local suggestions</p>
        <h2 id="country-heading">Find a country</h2>
        <p className="muted">Start with a country name. Try “is”, “un” or “ca”.</p>
        <label className="field" htmlFor="country-query">
          Country
        </label>
        <div className="country-input-row">
          <input
            id="country-query"
            ref={this.input}
            type="text"
            role="combobox"
            value={query}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            onFocus={() => {
              if (query.trim() && !selected) this.setState({ open: true });
            }}
            aria-autocomplete="list"
            aria-expanded={expanded}
            aria-controls="country-options"
            aria-activedescendant={
              expanded && activeIndex >= 0 ? `country-option-${activeIndex}` : undefined
            }
            aria-describedby="country-help country-status"
            autoComplete="off"
            spellCheck="false"
          />
          <button type="button" onClick={this.clear} disabled={!query} aria-label="Clear country">
            Clear
          </button>
        </div>
        <div className="country-options-frame">
          <ul
            id="country-options"
            ref={this.list}
            role="listbox"
            aria-label="Country suggestions"
            hidden={!expanded}
          >
            {suggestions.map((country, index) => (
              <li
                key={country}
                id={`country-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? "active" : ""}
                onPointerDown={event => event.preventDefault()}
                onClick={() => this.selectCountry(country)}
              >
                {country}
              </li>
            ))}
          </ul>
        </div>
        <p id="country-status" className="country-status" role="status" aria-live="polite">
          {selected
            ? `Selected: ${selected}.`
            : open && query.trim()
              ? suggestions.length
                ? `${suggestions.length} matching ${suggestions.length === 1 ? "country" : "countries"}.`
                : "No countries found. Try another starting letter."
              : cleared
                ? "Selection cleared."
                : "Type to see suggestions."}
        </p>
        <p id="country-help" className="muted country-help">
          Use ↑/↓ to explore, Enter to select and Escape to close. Tab continues to the next
          control.
        </p>
        <p className="muted country-help">
          A local demonstration list of {countries.length} countries. No data is sent or saved.
        </p>
      </section>
    );
  }
}

export default CountryAutocomplete;
