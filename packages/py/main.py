#!/usr/bin/env python3
"""Entry point for the py package.

    python main.py server     -> start the DiscoveryService
    python main.py discover   -> query a DiscoveryService (default)
"""
import sys


def main() -> None:
    cmd = sys.argv[1] if len(sys.argv) > 1 else "discover"
    if cmd == "server":
        from server import serve

        serve()
    elif cmd == "discover":
        from discover import fetch_tools

        fetch_tools()
    else:
        print(
            f"Unknown command: {cmd}\nUsage: python main.py <server|discover>",
            file=sys.stderr,
        )
        sys.exit(2)


if __name__ == "__main__":
    main()
