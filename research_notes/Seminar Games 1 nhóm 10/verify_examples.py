#!/usr/bin/env python3
"""Games 1 reference: game evaluation, expectimax, minimax on one interface (stdlib only)."""
import time
from fractions import Fraction as F

class Game:                                  # Actions, Succ, IsEnd, Utility, Player as in the slides
    def actions(s, st): raise NotImplementedError
    def succ(s, st, a): raise NotImplementedError
    def is_end(s, st): raise NotImplementedError
    def utility(s, st): raise NotImplementedError
    def player(s, st): raise NotImplementedError      # +1 agent (max), -1 opp

def game_eval(g, st, pi_a, pi_o):            # both policies fixed
    if g.is_end(st): return g.utility(st)
    pi = pi_a if g.player(st) == 1 else pi_o
    return sum(p * game_eval(g, g.succ(st, a), pi_a, pi_o) for a, p in pi(g, st).items())

def expectimax(g, st, pi_o):                 # opponent policy known
    if g.is_end(st): return g.utility(st)
    if g.player(st) == 1: return max(expectimax(g, g.succ(st, a), pi_o) for a in g.actions(st))
    return sum(p * expectimax(g, g.succ(st, a), pi_o) for a, p in pi_o(g, st).items())

def minimax(g, st):                          # opponent assumed worst-case
    if g.is_end(st): return g.utility(st)
    vals = [minimax(g, g.succ(st, a)) for a in g.actions(st)]
    return max(vals) if g.player(st) == 1 else min(vals)

def uniform(g, st): return {a: F(1, len(g.actions(st))) for a in g.actions(st)}
def greedy(value):                           # value -> deterministic policy (ties: first action)
    def pi(g, st):
        pick = max if g.player(st) == 1 else min
        return {pick(g.actions(st), key=lambda a: value(g, g.succ(st, a))): F(1)}
    return pi
pi_max = pi_min = greedy(minimax)
pi_exp = greedy(lambda g, st: expectimax(g, st, uniform))

class Buckets(Game):                         # games1.pdf slide 4; state = choices so far
    BINS = {"A": (-50, 50), "B": (1, 3), "C": (-5, 15)}
    def actions(s, st): return list(s.BINS) if not st else [0, 1]
    def succ(s, st, a): return st + (a,)
    def is_end(s, st): return len(st) == 2
    def utility(s, st): return s.BINS[st[0]][st[1]]
    def player(s, st): return -1 if st else 1

class Halving(Game):                         # games1.pdf slide 18; state = (player, number)
    def actions(s, st): return ["-", "/"]
    def succ(s, st, a): return (-st[0], st[1] - 1 if a == "-" else st[1] // 2)
    def is_end(s, st): return st[1] == 0
    def utility(s, st): return st[0] * float("inf")   # the player left with 0 wins
    def player(s, st): return st[0]

LINES = [(0,1,2), (3,4,5), (6,7,8), (0,3,6), (1,4,7), (2,5,8), (0,4,8), (2,4,6)]
class TicTacToe(Game):                       # state = (board, player); X = agent = +1
    def __init__(s): s.visits, s.ends, s.seen = 0, 0, set()
    def win(s, b): return next((b[i] for i, j, k in LINES if b[i] != "." and b[i] == b[j] == b[k]), None)
    def actions(s, st): return [i for i, c in enumerate(st[0]) if c == "."]
    def succ(s, st, a): return (st[0][:a] + "OX"[st[1] == 1] + st[0][a+1:], -st[1])
    def utility(s, st): return {"X": 1, "O": -1, None: 0}[s.win(st[0])]
    def player(s, st): return st[1]
    def is_end(s, st):
        s.visits += 1; s.seen.add(st); done = s.win(st[0]) is not None or "." not in st[0]
        s.ends += done; return done

def table(g, st, value):
    return {a: str(value(g, g.succ(st, a))) for a in g.actions(st)}

if __name__ == "__main__":
    g, s0 = Buckets(), ()
    pi_A = lambda g, st: {"A": F(1)}
    print("BUCKETS eval(A, uniform) =", game_eval(g, s0, pi_A, uniform),
          "| expectimax =", expectimax(g, s0, uniform), "| minimax =", minimax(g, s0))
    for na, a in (("pi_max", pi_max), ("pi_exp", pi_exp)):
        print(f"  {na}: vs pi_min = {game_eval(g, s0, a, pi_min)}, vs uniform = {game_eval(g, s0, a, uniform)}")
    h = Halving()
    print("HALVING agent wins at N =", [n for n in range(1, 41) if minimax(h, (1, n)) > 0])
    print("        agent loses at N =", [n for n in range(1, 41) if minimax(h, (1, n)) < 0])
    t = TicTacToe(); s = ("." * 9, 1); t0 = time.perf_counter(); v = minimax(t, s); dt = time.perf_counter() - t0
    print(f"TTT empty board: value={v}, node visits={t.visits}, terminal visits={t.ends}, "
          f"unique states={len(t.seen)}, runtime={dt:.2f}s (with counters)")
    for name, b in (("P (6 empty)", "...O.X.O."), ("Q (4 empty)", "...O.XXOO")):
        st = (b, 1)
        print(f"TTT {name} {b}\n  minimax   :", table(t, st, minimax))
        print("  expectimax:", table(t, st, lambda g, x: expectimax(g, x, uniform)))
    st = ("...O.X.O.", 1)
    for na, a in (("pi_max", pi_max), ("pi_exp", pi_exp)):
        print(f"  P {na}: vs pi_min = {game_eval(t, st, a, pi_min)}, vs uniform = {game_eval(t, st, a, uniform)}")
