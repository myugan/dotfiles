static void
bstackhoriz(Monitor *m) {
	int x, y, h, w, mh;
	unsigned int i, n;
	Client *c;

	for(n = 0, c = nexttiled(m->clients); c; c = nexttiled(c->next), n++);
	if(n == 0)
		return;
	/* master */
	c = nexttiled(m->clients);
	mh = m->mfact * m->wh;
	resize(c, m->wx, m->wy, m->ww - 2 * c->bw, (n == 1 ? m->wh : mh) - 2 * c->bw, False);
	if(--n == 0)
		return;
	/* tile stack */
	x = m->wx;
	y = (m->wy + mh > c->y + c->h) ? c->y + c->h + 2 * c->bw : m->wy + mh;
	w = m->ww;
	h = (m->wy + mh > c->y + c->h) ? m->wy + m->wh - y : m->wh - mh;
	h /= n;
	if(h < bh)
		h = m->wh;
	for(i = 0, c = nexttiled(c->next); c; c = nexttiled(c->next), i++) {
		resize(c, x, y, w - 2 * c->bw, /* remainder */ ((i + 1 == n)
		       ? m->wy + m->wh - y - 2 * c->bw : h - 2 * c->bw), False);
		if(h != m->wh)
			y = c->y + HEIGHT(c);
	}
}
