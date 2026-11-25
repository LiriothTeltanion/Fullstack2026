"""Remote Exercise: Our First GUI.

A small tkinter window: type a name, press Greet, and a counter keeps track
of how many greetings were shown. tkinter comes with Python, so nothing to
install.
"""

import tkinter as tk


def build_greeting(name, count):
    """Return the text for the label (kept apart from tkinter so it is easy to test)."""
    name = name.strip()
    if not name:
        return "Please type your name first."
    return f"Hello, {name.title()}! That's greeting number {count}."


def create_app():
    """Build the window and return it without starting the main loop."""
    root = tk.Tk()
    root.title("Our First GUI")
    root.geometry("360x180")

    clicks = {"count": 0}

    tk.Label(root, text="Your name:").pack(pady=(16, 4))
    name_entry = tk.Entry(root, width=30)
    name_entry.pack()

    message = tk.Label(root, text="", fg="navy")

    def on_greet():
        if name_entry.get().strip():
            clicks["count"] += 1
        message.config(text=build_greeting(name_entry.get(), clicks["count"]))

    def on_clear():
        name_entry.delete(0, tk.END)
        message.config(text="")

    buttons = tk.Frame(root)
    tk.Button(buttons, text="Greet", command=on_greet).pack(side=tk.LEFT, padx=4)
    tk.Button(buttons, text="Clear", command=on_clear).pack(side=tk.LEFT, padx=4)
    tk.Button(buttons, text="Quit", command=root.destroy).pack(side=tk.LEFT, padx=4)
    buttons.pack(pady=10)
    message.pack()

    # Pressing Enter in the text box works like the Greet button.
    name_entry.bind("<Return>", lambda event: on_greet())
    name_entry.focus()
    return root


def main():
    app = create_app()
    app.mainloop()


if __name__ == "__main__":
    main()
