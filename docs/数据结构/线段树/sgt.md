

# 线段树 (Segment Tree)

## 从基础到进阶

难度等级：提高 / 省选

涵盖：建树 · 单点修改 · 区间查询 · Lazy Tag · 动态开点 · 可持久化 · 合并与分裂 · 势能分析 · 优化建图 · 线段树分治

---

## 目录

1. 引入——为什么需要线段树？
2. 基础概念——结构与建树
3. 核心操作——单点修改 & 区间查询
4. 懒惰标记——区间修改的利器
5. 进阶变体——动态开点 · 权值线段树 · 可持久化
6. 线段树合并 & 分裂
7. 势能分析——复杂度保证
8. 线段树优化建图——区间连边
9. 线段树分治——时间维度上的离线分治
10. 经典例题 & 注意事项

---

## 一、引入

### 问题场景

给定一个长度为 `n` 的数组 `a`，需要支持以下操作：

| 操作 | 描述 | 暴力复杂度 |
|---|---|---|
| 单点修改 | 将 `a[i]` 增加 `v` | `O(1)` |
| 区间求和 | 查询 `sum_{i=l}^{r} a[i]` | `O(n)` |
| 区间最值 | 查询 `max_{i=l}^{r} a[i]` | `O(n)` |

问题：如果操作次数 `q` 很大（如 `10^5` 级别），暴力 `O(nq)` 无法承受。

### 前缀和的局限

对于区间求和，可以用前缀和优化到 `O(1)` 查询：

```
sum_{i=l}^{r} a[i] = pre[r] - pre[l-1]
```

但如果有修改操作，每次修改后需要 `O(n)` 更新前缀和。

我们需要一个数据结构，同时支持高效的修改和查询。

→ 线段树：修改和查询都是 `O(log n)`

---

## 二、基本概念与建树

### 线段树的定义

线段树是一棵二叉树，每个节点代表一段区间：

- 根节点：维护区间 `[1, n]`
- 叶子节点：维护单个元素 `a[i]`
- 内部节点：维护其两个子节点区间的合并信息

### 存储方式（堆式存储）

类似二叉堆，用数组存储线段树：

| 规则 | 说明 |
|---|---|
| 根节点编号 | 1 |
| 左儿子 | `p * 2`（即 `p << 1`） |
| 右儿子 | `p * 2 + 1`（即 `p << 1 | 1`） |
| 数组大小 | 开 4 倍（最坏情况约 `4n - 5`） |

为什么是 4 倍？线段树高度 `⌈log2(n)⌉ + 1`，最多约 `2^(⌈log n⌉+1) - 1 <= 4n - 5` 个节点。

### 建树 (Build) —— 算法流程

递归构建：自顶向下分割区间，自底向上合并信息。

```
build(s, t, p):
  ① 若 s == t（叶子节点）：d[p] = a[s], return
  ② 计算 mid = (s + t) / 2
  ③ 递归构建左子树：build(s, mid, p*2)
  ④ 递归构建右子树：build(mid+1, t, p*2+1)
  ⑤ 合并（pushup）：d[p] = d[p*2] + d[p*2+1]
```

此处的"合并"操作称为 `pushup`：用子节点信息更新父节点。

### 建树 (Build) —— 代码

```cpp
void build(int s, int t, int p) {
    if (s == t) {
        d[p] = a[s];  // 叶子节点直接赋值
        return;
    }
    int m = s + ((t - s) >> 1);  // 防溢出写法
    build(s, m, p * 2);
    build(m + 1, t, p * 2 + 1);
    d[p] = d[p * 2] + d[p * 2 + 1];  // pushup
}

// 调用: build(1, n, 1);
```

时间复杂度：`O(n)` —— 每个节点访问一次。

---

## 三、单点修改 & 区间查询

### 单点修改 —— 算法流程

将 `a[k]` 增加 `v`，只需更新从根到叶子路径上的所有节点。

```
update(s, t, p, k, v):
  ① 若 s == t（到达叶子）: d[p] += v, return
  ② 计算 mid = (s + t) / 2
  ③ 若 k <= mid: 递归左子树 update(s, mid, p*2, k, v)
     否则: 递归右子树 update(mid+1, t, p*2+1, k, v)
  ④ pushup: d[p] = d[p*2] + d[p*2+1]
```

每次只走一条路径，时间复杂度 `O(log n)`。

### 单点修改 —— 代码

```cpp
void update(int s, int t, int p, int k, int v) {
    if (s == t) {
        d[p] += v;  // 到达叶子
        return;
    }
    int m = s + ((t - s) >> 1);
    if (k <= m)
        update(s, m, p * 2, k, v);
    else
        update(m + 1, t, p * 2 + 1, k, v);
    d[p] = d[p * 2] + d[p * 2 + 1];  // pushup
}

// 调用: update(1, n, 1, k, v);
```

### 区间查询 —— 算法流程

查询 `[l, r]` 的区间和，只需访问与查询区间有交集的节点。

核心三种情况：

| 情况 | 操作 |
|---|---|
| 当前区间 `[s, t]` 完全包含于 `[l, r]` | 直接返回 `d[p]` |
| 当前区间与 `[l, r]` 无交集 | 返回 0 |
| 当前区间与 `[l, r]` 部分相交 | 递归查询左右儿子并累加 |

每层最多访问 2 个节点，不会扩展到 4 个——这保证了 `O(log n)` 的复杂度。

### 区间查询 —— 代码

```cpp
int query(int l, int r, int s, int t, int p) {
    if (l <= s && t <= r)  // 完全包含
        return d[p];
    int m = s + ((t - s) >> 1);
    int sum = 0;
    if (l <= m)  // 左儿子有交集
        sum += query(l, r, s, m, p * 2);
    if (r > m)   // 右儿子有交集
        sum += query(l, r, m + 1, t, p * 2 + 1);
    return sum;
}

// 调用: query(l, r, 1, n, 1);
```

### 复杂度分析

| 操作 | 时间复杂度 |
|---|---|
| 建树 (build) | `O(n)` |
| 单点修改 (update) | `O(log n)` |
| 区间查询 (query) | `O(log n)` |

适用范围：线段树维护的信息需要满足**结合律**（如 `+`, `×`, `max`, `min`, `gcd` 等）。不要求满足交换律，所以可以维护矩阵等不满足交换律的元素。

### 基础版完整模板

```cpp
const int N = 100005;
int n, a[N];
long long d[4 * N];

void build(int s, int t, int p) {
    if (s == t) {
        d[p] = a[s];
        return;
    }
    int m = (s + t) >> 1;
    build(s, m, p << 1);
    build(m + 1, t, p << 1 | 1);
    d[p] = d[p << 1] + d[p << 1 | 1];
}

void update(int s, int t, int p, int k, int v) {
    if (s == t) {
        d[p] += v;
        return;
    }
    int m = (s + t) >> 1;
    if (k <= m) update(s, m, p << 1, k, v);
    else update(m + 1, t, p << 1 | 1, k, v);
    d[p] = d[p << 1] + d[p << 1 | 1];
}

long long query(int l, int r, int s, int t, int p) {
    if (l <= s && t <= r) return d[p];
    int m = (s + t) >> 1;
    long long sum = 0;
    if (l <= m) sum += query(l, r, s, m, p << 1);
    if (r > m) sum += query(l, r, m + 1, t, p << 1 | 1);
    return sum;
}
```

---

## 四、懒惰标记 (Lazy Tag)

### 为什么需要 Lazy Tag？

我们刚刚只实现了线段树的单点修改区间查询，可是假如我们需要区间修改怎么办？

如果直接对整个区间加上一个值，朴素线段树需要修改区间内每一个元素对应的叶子节点就需要 `O(n log n)`，比暴力还差！

**懒惰标记的思想：**

"既然整个区间都要加 `v`，我们不妨先把这笔账记在区间对应的节点上，等需要用到它儿子的时候再往下传。"

### 标记下传 (Pushdown)

当需要访问一个节点的子节点时，必须先把标记下传：

```cpp
void pushdown(int s, int t, int p) {
    if (!b[p]) return;  // 无标记则跳过
    int m = (s + t) >> 1;

    // 左儿子: 更新 sum 和 tag
    d[p << 1] += b[p] * (m - s + 1);
    b[p << 1] += b[p];

    // 右儿子: 更新 sum 和 tag
    d[p << 1 | 1] += b[p] * (t - m);
    b[p << 1 | 1] += b[p];

    b[p] = 0;  // 清除当前标记
}
```

### 区间修改 —— 代码

```cpp
void update(int l, int r, int c, int s, int t, int p) {
    if (l <= s && t <= r) {  // 完全包含：直接打标记
        d[p] += (t - s + 1) * c;
        b[p] += c;
        return;  // 不再递归!
    }
    pushdown(s, t, p);  // 先下传标记
    int m = (s + t) >> 1;
    if (l <= m) update(l, r, c, s, m, p << 1);
    if (r > m) update(l, r, c, m + 1, t, p << 1 | 1);
    d[p] = d[p << 1] + d[p << 1 | 1];  // pushup
}
```

时间复杂度 `O(log n)` —— 每层最多操作 2 个节点。

### 带 Lazy Tag 的区间查询

```cpp
long long query(int l, int r, int s, int t, int p) {
    if (l <= s && t <= r) return d[p];  // 完全包含
    pushdown(s, t, p);  // 查询前先下传!
    int m = (s + t) >> 1;
    long long sum = 0;
    if (l <= m) sum += query(l, r, s, m, p << 1);
    if (r > m) sum += query(l, r, m + 1, t, p << 1 | 1);
    return sum;
}
```

关键：查询在进入子节点之前，也必须先调用 `pushdown`，否则儿子节点的数据是"过期的"。

### Lazy Tag 完整模板

```cpp
long long d[4 * N], b[4 * N];  // d: 区间和, b: 懒标记

void build(int s, int t, int p) {
    if (s == t) { d[p] = a[s]; return; }
    int m = (s + t) >> 1;
    build(s, m, p << 1);
    build(m + 1, t, p << 1 | 1);
    d[p] = d[p << 1] + d[p << 1 | 1];
}

void pushdown(int s, int t, int p) {
    if (!b[p]) return;
    int m = (s + t) >> 1;
    d[p << 1] += b[p] * (m - s + 1);
    d[p << 1 | 1] += b[p] * (t - m);
    b[p << 1] += b[p];
    b[p << 1 | 1] += b[p];
    b[p] = 0;
}

void update(int l, int r, int c, int s, int t, int p) {
    if (l <= s && t <= r) {
        d[p] += (t - s + 1) * c;
        b[p] += c;
        return;
    }
    pushdown(s, t, p);
    int m = (s + t) >> 1;
    if (l <= m) update(l, r, c, s, m, p << 1);
    if (r > m) update(l, r, c, m + 1, t, p << 1 | 1);
    d[p] = d[p << 1] + d[p << 1 | 1];
}

long long query(int l, int r, int s, int t, int p) {
    if (l <= s && t <= r) return d[p];
    pushdown(s, t, p);
    int m = (s + t) >> 1;
    long long sum = 0;
    if (l <= m) sum += query(l, r, s, m, p << 1);
    if (r > m) sum += query(l, r, m + 1, t, p << 1 | 1);
    return sum;
}
```

### 多标记：同时有加法 & 乘法

P3373【模板】线段树 2 中同时有区间加和区间乘，需要两个标记：

```cpp
long long d[4 * N], add[4 * N], mul[4 * N];
// add: 加法标记, mul: 乘法标记
```

**标记下传的关键顺序：先乘后加**

具体的说，对于懒标记 `(add, mul)`，它表示对每个数 `x` 执行 `x * mul + add`

- 当使用加法操作 `y` 时，只需把标记变为 `(add + y, mul)`
- 当使用乘法操作 `z` 时，只需把标记变为 `(add * z, mul * z)`

但如果是先加后乘，就无法正确处理这些标记，对于懒标记 `(add, mul)` 再实现加法操作 `y` 就只能是 `(add + y/mul, mul)` 了，难以维护。

### 多标记：同时有加法 & 乘法

```cpp
void pushdown(int s, int t, int p) {
    int m = (s + t) >> 1;
    int lc = p << 1, rc = p << 1 | 1;

    // 先处理乘法，再处理加法
    d[lc] = (d[lc] * mul[p] + add[p] * (m - s + 1)) % MOD;
    d[rc] = (d[rc] * mul[p] + add[p] * (t - m)) % MOD;

    mul[lc] = mul[lc] * mul[p] % MOD;
    mul[rc] = mul[rc] * mul[p] % MOD;

    add[lc] = (add[lc] * mul[p] + add[p]) % MOD;
    add[rc] = (add[rc] * mul[p] + add[p]) % MOD;

    mul[p] = 1;   // 乘法标记初始化为 1
    add[p] = 0;
}
```

---

## 五、进阶变体

### 动态开点线段树

问题：值域范围极大（如 `[-10^9, 10^9]`），无法直接开 4 倍空间。

解决：放弃开整个数组，改用指针式——需要节点时才创建。

```cpp
struct Node {
    int lc, rc;  // 左右儿子编号（不再是 p*2, p*2+1）
    long long sum, tag;
} tr[N << 5];  // 空间：n log V 级别

int tot = 0;  // 当前已用节点数

int newNode() {
    tot++;
    tr[tot].lc = tr[tot].rc = tr[tot].sum = tr[tot].tag = 0;
    return tot;
}
```

### 动态开点 —— 区间修改

```cpp
void update(int &p, int l, int r, int ql, int qr, int v) {
    if (!p) p = newNode();  // 动态创建节点
    if (ql <= l && r <= qr) {
        tr[p].sum += (r - l + 1) * v;
        tr[p].tag += v;
        return;
    }
    pushdown(p, l, r);
    int mid = (l + r) >> 1;
    if (ql <= mid) update(tr[p].lc, l, mid, ql, qr, v);
    if (qr > mid) update(tr[p].rc, mid + 1, r, ql, qr, v);
    tr[p].sum = tr[tr[p].lc].sum + tr[tr[p].rc].sum;
}
```

空间复杂度：每次操作仅新增 `O(log V)` 个节点。总节点数 `O(m log V)`。

### 权值线段树

普通线段树维护的是数组下标区间，权值线段树维护的是值域区间。

|  | 普通线段树 | 权值线段树 |
|---|---|---|
| 维护对象 | 下标区间 `[l, r]` | 值域区间 `[L, R]` |
| 叶子含义 | 数组元素 `a[i]` | 值等于 `v` 的元素个数 |
| 典型操作 | 区间求和/最值 | 求第 k 小、排名、前驱后继 |

```cpp
// 排名查询: 统计 < x 的数的个数
int queryRank(int p, int l, int r, int x) {
    if (l == r) return 0;
    int mid = (l + r) >> 1;
    if (x <= mid) return queryRank(tr[p].lc, l, mid, x);
    return tr[tr[p].lc].cnt + queryRank(tr[p].rc, mid + 1, r, x);
}
```

### 可持久化线段树（主席树）

全称：可持久化权值线段树 (Persistent Segment Tree / Chairman Tree)

核心思想：保存每次修改后的历史版本。

每次修改只新增 `O(log n)` 个节点（一条路径），其他节点复用旧版本。

- 必须使用动态开点（节点编号关系复杂，不能使用乘法简单获取）
- 通过 `root[i]` 记录第 `i` 个版本的树根
- 利用前缀和差分：`[l, r]` 的信息 = 版本 `r` - 版本 `l-1`

### 可持久化线段树 —— 核心代码

```cpp
// 单点修改：新增一条链
int update(int pre, int l, int r, int k, int v) {
    int p = ++tot;
    tr[p] = tr[pre];  // 复制旧节点
    if (l == r) {
        tr[p].sum += v;
        return p;
    }
    int mid = (l + r) >> 1;
    if (k <= mid)
        tr[p].lc = update(tr[pre].lc, l, mid, k, v);
    else
        tr[p].rc = update(tr[pre].rc, mid + 1, r, k, v);
    tr[p].sum = tr[tr[p].lc].sum + tr[tr[p].rc].sum;
    return p;
}

// 查询区间第 k 小：[L, R] 中第 k 小
int query(int u, int v, int l, int r, int k) {
    if (l == r) return l;
    int mid = (l + r) >> 1;
    int x = tr[tr[v].lc].sum - tr[tr[u].lc].sum;  // 前缀和差分
    if (k <= x) return query(tr[u].lc, tr[v].lc, l, mid, k);
    else return query(tr[u].rc, tr[v].rc, mid + 1, r, k - x);
}
```

### 可持久化线段树的具体应用

**1. 静态区间第 k 小（经典问题）**

这是主席树最广为人知的应用。将数组的每个前缀版本建立权值线段树，查询 `[l, r]` 时使用版本 `r` 和 `l-1` 的差树进行二分查找。模板代码已在上一页给出。

**2. 树上路径第 k 小**

将问题从序列扩展到树。每个节点从父节点继承并插入点权，建立可持久化线段树。查询路径 `(u, v)` 时，利用四个版本的节点信息进行计算：

`root[u] + root[v] - root[lca] - root[parent[lca]]`

**3. 可持久化并查集**

用于解决需要记录并查集历史版本的题目（如判断某次操作后的连通性）。核心是用可持久化数组维护 `fa` 和 `size`（或 `rank`），每次合并时在对应版本上修改。

### 线段树合并

将两棵动态开点线段树的信息合并为一棵。

```cpp
int merge(int a, int b, int l, int r) {
    if (!a) return b;  // 一方为空，返回另一方
    if (!b) return a;
    if (l == r) {
        tr[a].sum += tr[b].sum;  // 叶子节点合并
        return a;
    }
    int mid = (l + r) >> 1;
    tr[a].lc = merge(tr[a].lc, tr[b].lc, l, mid);
    tr[a].rc = merge(tr[a].rc, tr[b].rc, mid + 1, r);
    tr[a].sum = tr[tr[a].lc].sum + tr[tr[a].rc].sum;
    return a;
}
```

复杂度：总复杂度 `O(n log n)`（均摊），平均每次合并 `O(log n)`。

### 线段树分裂

按值域阈值将一棵权值线段树拆成两棵。

```cpp
void split(int a, int &b, int k) {  // 前 k 个元素留给 a，剩余分给 b
    if (!a) return;
    b = ++tot;
    int left_cnt = tr[tr[a].lc].sum;
    if (k > left_cnt)
        split(tr[a].rc, tr[b].rc, k - left_cnt);
    else
        swap(tr[a].rc, tr[b].rc);
    if (k < left_cnt)
        split(tr[a].lc, tr[b].lc, k);
    tr[b].sum = tr[a].sum - k;
    tr[a].sum = k;
}
```

应用：多重集的分裂与合并、值域上的序关系处理。

**1. 树上问题（子树信息统计）**

在树上，每个节点维护一棵权值线段树（存储其子树内所有点的信息）。通过自底向上的 `merge`，将子节点的线段树合并到父节点。可以高效解决"查询子树内第 k 小"或"子树内不同颜色数"等问题。

**2. 区间排序问题**

利用线段树分裂与合并可以维护一个序列的多次区间排序操作。对于每次对 `[l, r]` 的排序：

1. 分裂：将原序列所在的线段树分裂出 `[1, l-1]`、`[l, r]`、`[r+1, n]` 三棵子树。
2. 排序：升序则合并左子树和右子树（保留左子树在前）；降序则相反。
3. 合并：将处理好的三棵子树再合并回去。

最终可以 `O((n+q)log n)` 地得到排序后的序列。

---

## 六、扫描线 (Scanline)

问题：求 `n` 个矩形在二维平面上的面积并。

矩形1: `[1, 5] × [1, 4]`
矩形2: `[3, 7] × [2, 6]`
矩形3: `[4, 6] × [3, 5]`

这些矩形之间有重叠，直接算面积会重复。暴力枚举每个单位格显然不现实（坐标范围可达 `10^9`）。

### 核心思路

用一根平行于 `y` 轴的直线，从左到右扫过整个平面。

在任意时刻，扫描线会被若干个矩形切割，我们只需要知道扫描线上被覆盖的总长度。

相邻两次事件之间的面积 = 覆盖长度 × 水平距离。

因此问题转化成两个子问题：

1. 生成所有事件（矩形的左右边界）
2. 用数据结构维护 `y` 轴上被覆盖的总长度，支持区间加/减

### 事件的定义

每个矩形提供两条竖边：

矩形 `[x1, x2] × [y1, y2]`

→ 左边界: `(x1, y1, y2, +1)`  // 进入矩形，区间 +1
→ 右边界: `(x2, y1, y2, -1)`  // 离开矩形，区间 -1

```cpp
struct Event {
    int x, y1, y2, val;  // val = +1 或 -1
};

// 读入每个矩形，生成两个事件
events.push_back({x1, y1, y2, 1});
events.push_back({x2, y1, y2, -1});
```

按 `x` 从小到大排序后逐个处理。

### 离散化

`y` 坐标的范围很大（比如 `-10^9` 到 `10^9`），不可能直接开数组。

把所有出现过的 `y` 坐标收集起来，排序去重：

```cpp
vector<int> ys;  // 所有 y 坐标
sort(ys.begin(), ys.end());
ys.erase(unique(ys.begin(), ys.end()), ys.end());
```

假设有 `m` 个不同的 `y` 坐标，它们将数轴分成 `m-1` 个区间：

```
ys[0] —— ys[1] —— ys[2] —— ... —— ys[m-1]
 区间0     区间1           区间 m-2
```

线段树的叶子节点 `k` 维护的是区间 `[ys[k], ys[k+1]]`。

### 线段树节点设计

```cpp
struct Node {
    int cnt;   // 整个区间被完整覆盖的次数
    int len;   // 区间内被覆盖的实际长度
} tr[4 * M];
```

这里 `cnt` 和 `len` 的含义需要仔细区分：

| 字段 | 含义 | 特点 |
|---|---|---|
| `cnt` | 当前节点代表的区间被完整覆盖的次数 | 只累加，不下传 |
| `len` | 当前节点代表的区间内被覆盖的总长度 | 由 `cnt` 和子节点共同决定 |

`cnt` 为什么不下传？因为我们只需要知道根节点的 `len`，而根节点的 `len` 可以通过所有节点的 `cnt` 和区间长度计算出来。下传反而会破坏"只记录完整覆盖"的简洁性。

注意：节点 `p` 代表的是从 `ys[l]` 到 `ys[r+1]` 这一段区间，所以实际长度是两个离散坐标的差。

### 更新操作

```cpp
void update(int L, int R, int val, int l, int r, int p) {
    if (L <= l && r <= R) {
        tr[p].cnt += val;
        pushup(p, l, r);
        return;
    }
    int mid = (l + r) >> 1;
    if (L <= mid) update(L, R, val, l, mid, p << 1);
    if (R > mid) update(L, R, val, mid + 1, r, p << 1 | 1);
    pushup(p, l, r);
}
```

关键点：这里没有 `pushdown`！因为 `cnt` 标记不需要往下传。当父节点的 `cnt > 0` 时，它的 `len` 直接取整个区间长度，子节点的数据是否正确并不重要。当父节点的 `cnt` 减到 0 时，`pushup` 会重新从子节点获取数据，而此时子节点的数据一直是准确的。

### 主流程

```cpp
sort(events.begin(), events.end(), [](const Event& a, const Event& b) {
    if (a.x != b.x) return a.x < b.x;
    return a.val > b.val;  // 相同 x，先加后减
});

long long ans = 0;
for (int i = 0; i < events.size(); i++) {
    if (i > 0) {
        int dx = events[i].x - events[i - 1].x;
        ans += 1LL * dx * tr[1].len;
    }
    int L = lower_bound(ys.begin(), ys.end(), events[i].y1) - ys.begin();
    int R = lower_bound(ys.begin(), ys.end(), events[i].y2) - ys.begin() - 1;
    if (L <= R) {
        update(L, R, events[i].val, 0, (int)ys.size() - 2, 1);
    }
}
```

---

## 七、势能分析 (Potential Method)

### 什么是势能分析？

对于一些特殊的区间修改操作（如区间开方、区间取模），无法使用 Lazy Tag，但我们可以利用操作具有"值域衰减"的特性来证明总复杂度。

**核心思想：**

1. 定义一个"势能" `Φ`（例如区间内所有元素值的某种上界）。
2. 每次暴力修改一个叶子节点或一个节点，都会消耗一些势能。
3. 虽然单次操作可能很慢（`O(n)`），但总势能有限，因此均摊复杂度很低。

### 经典案例 1：区间开方

操作：将区间 `[l, r]` 内每个数 `a[i]` 变为 `floor(sqrt(a[i]))`。

**势能分析：**

- 定义势能 `Φ = sum(log log a[i])`（或简单视为元素值大小）。
- 一个大于 1 的数，经过有限次（约 `log log max` 次）开方后会变成 1。
- 变成 1 后，开方操作不再改变其值，可以打标记跳过。

实现技巧：线段树维护区间最大值 `mx`。

- 若 `mx <= 1`，则该区间无需更新，直接返回。
- 否则，递归到叶子节点进行单点开方，并 `pushup`。

复杂度：每个叶子节点最多被修改 `O(log log V)` 次，总复杂度 `O((n+q) log n log log V)`。

```cpp
void update(int l, int r, int s, int t, int p) {
    // 剪枝：如果区间最大值 <= 1，开方操作不再改变任何值
    if (mx[p] <= 1) return;
    // 到达叶子节点：执行开方
    if (s == t) {
        sum[p] = sqrt(sum[p]);
        mx[p] = sum[p];
        return;
    }
    int m = (s + t) >> 1;
    if (l <= m) update(l, r, s, m, p << 1);
    if (r > m) update(l, r, m + 1, t, p << 1 | 1);
    pushup(p);
}
```

### 经典案例 2：区间取模

操作：将区间 `[l, r]` 内每个数 `a[i]` 变为 `a[i] mod m`

**势能分析：**

- 对于一个数 `x` 和模数 `m`，若 `x < m`，则 `x mod m = x`，操作无效。
- 若 `x >= m`，则 `x mod m <= x/2`。因此，每个数在被有效取模后，其值至少减半。

实现技巧：线段树维护区间最大值 `mx`。

- 若 `mx < m`，则该区间无需更新，直接返回。
- 否则，递归到叶子节点进行单点取模，并 `pushup`。

复杂度：每个叶子节点最多被有效修改 `O(log V)` 次，总复杂度 `O((n+q) log n log V)`。

### 势能分析 —— 注意事项

| 要点 | 说明 |
|---|---|
| 暴力是基础 | 势能分析线段树本质上是一种暴力，但通过势能保证了总复杂度 |
| 判断条件 | 必须在节点维护额外的信息（如最大值、最小值或和）来判断是否需要继续递归 |
| 均摊并非严格 | 单次操作可能很慢达到 `O(n)`，但总操作次数有保障 |
| 常见操作 | 区间开方、区间取模、区间 gcd 变化、区间覆盖后执行某种操作等 |

---

## 八、线段树优化建图

### 问题背景

场景：给定一个图，存在从单点到区间、或区间到单点、甚至区间到区间的连边操作。

朴素做法：对区间 `[l, r]` 内的每个点分别连边，复杂度 `O(n)` 一条边，`q` 条边则 `O(nq)`。

线段树优化建图：利用线段树的区间分解特性，将 `O(n)` 条边优化为 `O(log n)` 条边。

### 核心思想

**两棵线段树：**

- **出树（出边树）**：从父节点向子节点连边（边权 0），表示"从区间出发可以到达其子区间"。
- **入树（入边树）**：从子节点向父节点连边（边权 0），表示"到达区间等价于到达其子区间"。

| 操作 | 建边方法 |
|---|---|
| 点 u → 区间 [l, r] | u 连向入树中覆盖 [l, r] 的 `O(log n)` 个节点 |
| 区间 [l, r] → 点 u | 出树中覆盖 [l, r] 的 `O(log n)` 个节点连向 u |
| 区间 [l1, r1] → 区间 [l2, r2] | 虚拟节点 mid，[l1, r1] → mid → [l2, r2] |

### 建图结构示意

```
出树（从上到下）              入树（从下到上）
     [1, n]                      [1, n]
    /      \                    /      \
 [1, m]  [m+1, n]          [1, m]  [m+1, n]
 /  \    /  \              /  \    /  \
... ... ... ...          ... ... ... ...
```

- 出树边：`fa → lc`，`fa → rc`（边权 0）
- 入树边：`lc → fa`，`rc → fa`（边权 0）
- 叶子互连：出树叶子 ↔ 入树叶子（边权 0），表示同一个点

### 复杂度与应用

| 项目 | 内容 |
|---|---|
| 点数 | `O(n)`（约 8n） |
| 边数 | 建树 `O(n)` + 每条区间边 `O(log n)` |
| 总复杂度 | `O((n+q) log n)` |

**经典应用：**

- 最短路问题：在优化建图后的图上跑 Dijkstra。
- DP 优化：将区间转移转化为图上的最短/长路问题。

经典例题：CF 786B Legacy —— 三种操作：① `u -> v` ② `u -> [l, r]` ③ `[l, r] -> u`，求单源最短路。

---

## 九、线段树分治

### 问题背景

场景：有一系列操作，每个操作只在一段时间区间内有效（或每个修改有生效区间），需要回答所有时刻的查询。

线段树分治：将时间轴建立线段树，每个操作挂载到其生效区间对应的时间线段树节点上，然后 DFS 遍历整棵线段树，用可撤销数据结构维护当前路径上的贡献。

核心思想：将一个动态问题离线转化为静态问题，用时间换空间。

### 算法流程

时间轴线段树 `[1, T]`

```
        [1, T]
       /      \
  [1, T/2]  [T/2+1, T]
   /    \    /    \
 ...   ... ...   ...
```

1. 将每个操作的生效区间 `[l, r]` 分解为 `O(log T)` 个线段树节点
2. 将操作信息存入这些节点（如 `vector`）
3. DFS 遍历线段树：
   - 进入节点时：执行该节点存储的所有操作（修改数据结构）
   - 到达叶子：回答该时刻的查询
   - 离开节点时：撤销该节点的所有操作（回溯）

### 典型应用：动态图连通性

问题：给定一个图，边在 `[l, r]` 时间内存在，询问每个时刻图的连通性（或两点是否连通）。

**做法：**

1. 建立时间轴线段树 `[1, T]`，将每条边的存在区间挂载上去。
2. DFS 遍历线段树，进入节点时将边加入可撤销并查集。
3. 到达叶子时，检查当前并查集中两点是否连通。
4. 离开节点时，撤销该节点加入的所有边。

### 可撤销并查集

```cpp
struct DSU {
    int fa[N], sz[N], top;
    struct Change { int x, y, sz_y; } stk[N * 20];

    int find(int x) {
        while (fa[x] != x) x = fa[x];
        return x;
    }  // 无路径压缩

    void merge(int x, int y) {
        x = find(x), y = find(y);
        if (x == y) { stk[++top] = {x, y, -1}; return; }
        if (sz[x] > sz[y]) swap(x, y);
        stk[++top] = {x, y, sz[y]};
        fa[x] = y;
        sz[y] += sz[x];
    }

    void undo(int k) {  // 撤销 top 到 k 之间的操作
        while (top > k) {
            auto [x, y, sz_y] = stk[top--];
            if (sz_y == -1) continue;  // 原本就连通
            fa[x] = x;
            sz[y] = sz_y;
        }
    }
};
```

### 线段树分治 —— DFS 框架

```cpp
vector<pair<int,int>> ops[N << 2];  // 每个线段树节点存储的边操作
DSU dsu;

void addOp(int p, int l, int r, int ql, int qr, int u, int v) {
    if (ql <= l && r <= qr) {
        ops[p].push_back({u, v});
        return;
    }
    int mid = (l + r) >> 1;
    if (ql <= mid) addOp(p << 1, l, mid, ql, qr, u, v);
    if (qr > mid) addOp(p << 1 | 1, mid + 1, r, ql, qr, u, v);
}

void dfs(int p, int l, int r) {
    int snapshot = dsu.top;
    for (auto [u, v] : ops[p]) dsu.merge(u, v);

    if (l == r) {
        // 回答时刻 l 的查询
    } else {
        int mid = (l + r) >> 1;
        dfs(p << 1, l, mid);
        dfs(p << 1 | 1, mid + 1, r);
    }

    dsu.undo(snapshot);
}
```

---

## 十、应用 & 例题

### 应用场景总结

| 场景 | 说明 | 线段树类型 |
|---|---|---|
| 区间求和/最值 | 最基础的应用 | 普通线段树 |
| 区间加/乘/赋值 | 多种区间修改 | Lazy Tag 线段树 |
| 区间第 k 小 | 静态/动态区间查询 | 可持久化/树套树 |
| 子段和/最大子段 | 区间合并型维护多变量 | 线段树 |
| 矩形面积/周长并 | 扫描线 | 扫描线 + 线段树 |
| 树上路径第 k 小 | 树上查询 | 可持久化线段树 |
| 可持久化并查集 | 历史版本连通性 | 可持久化数组 |
| 区间排序 | 维护有序序列 | 线段树合并 + 分裂 |
| 子树信息统计 | 树上离线问题 | 线段树合并 |
| 区间开方/取模 | 特殊区间修改 | 势能分析线段树 |
| 区间连边最短路 | 图上连边优化 | 线段树优化建图 |
| 动态图连通性 | 时间维度上的离线分治 | 线段树分治 |
| 带撤销背包/DP | 时间区间限制 | 线段树分治 |

### 经典例题 (1) —— P3372 线段树 1

题目：洛谷 P3372

| 项目 | 内容 |
|---|---|
| 操作 | ① 区间加 k ② 区间求和 |
| 核心 | 单 Lazy Tag（加法标记） |

**思路：**

1. 使用带懒标记的线段树模板
2. `update(l, r, k, 1, n, 1)` 时：完全覆盖则打标记并更新 `sum`；否则 `pushdown` 后递归
3. `query(l, r, 1, n, 1)` 时：完全覆盖直接返回；否则 `pushdown` 后递归求和

### 经典例题 (2) —— P3373 线段树 2

题目：洛谷 P3373

| 项目 | 内容 |
|---|---|
| 操作 | ① 区间加 ② 区间乘 ③ 区间求和（取模） |
| 核心 | 双 Lazy Tag（加法 + 乘法），先乘后加 |

易错点：

- 乘法标记初始化 `mul[p] = 1`，不是 0！
- `pushdown` 时必须先乘后加：
  - `sum_child = sum_child * mul_parent + add_parent * len_child`
  - `mul_child = mul_child * mul_parent`
  - `add_child = add_child * mul_parent + add_parent`

### 经典例题 (3) —— P3834 可持久化线段树

题目：洛谷 P3834

| 项目 | 内容 |
|---|---|
| 问题 | 静态区间第 k 小 |
| 核心 | 可持久化权值线段树 + 前缀和差分 |

**思路：**

1. 离散化原数组值域，依次插入每个元素，每次新建一个版本 `root[i]`
2. 查询 `[l, r]` 第 k 小：在 `root[r]` 和 `root[l-1]` 的差树上二分
3. 左儿子元素个数 `x = sum[ls(r)] - sum[ls(l-1)]`
   - 若 `k <= x`：去左儿子找第 `k` 小
   - 否则：去右儿子找第 `k - x` 小

### 经典例题 (4) —— P5494【模板】线段树分裂

题目：洛谷 P5494

| 项目 | 内容 |
|---|---|
| 操作 | ① 合并两棵权值线段树 ② 分裂出一棵新树 ③ 查询第 k 小/排名/前驱后继 |
| 核心 | 动态开点 + `merge()` + `split()` |

**思路：**

- 用 `merge` 实现集合的并集操作
- 用 `split` 按值域大小将一棵树拆成两棵，用于序列的区间提取
- 结合这些操作，可以实现对序列的区间排序、动态维护多重集等复杂问题

### 经典例题 (5) —— P4145 花神游历各国

题目：洛谷 P4145

| 项目 | 内容 |
|---|---|
| 操作 | ① 区间开方 ② 区间求和 |
| 核心 | 势能分析 + 维护最大值 |

**思路：**

1. 线段树维护区间和 `sum` 和最大值 `mx`
2. 区间开方时，若 `mx <= 1`，则直接返回（因为开方无效）
3. 否则递归到叶子节点进行单点开方，并 `pushup`

### 经典例题 (6) —— CF 786B Legacy

题目：Codeforces 786B

| 项目 | 内容 |
|---|---|
| 操作 | ① `u -> v` ② `u -> [l, r]` ③ `[l, r] -> u`，求单源最短路 |
| 核心 | 线段树优化建图 + Dijkstra |

**思路：**

1. 建立两棵线段树（出树和入树），叶子对应原图节点
2. 建树时内部连 0 权边
3. 对于每条区间边，用线段树区间分解找到对应节点并连边
4. 在优化后的图上跑 Dijkstra

### 经典例题 (7) —— P5787 二分图 / 【模板】线段树分治

题目：洛谷 P5787

| 项目 | 内容 |
|---|---|
| 问题 | 每条边在 `[l, r]` 时间内存在，判断每个时刻图是否为二分图 |
| 核心 | 线段树分治 + 可撤销并查集（维护奇偶性） |

**思路：**

1. 将每条边按存在时间挂载到线段树上
2. DFS 遍历线段树，进入节点时加入边
3. 用可撤销并查集维护二分图判定（额外维护每个点到根的距离奇偶性）
4. 到达叶子时判断是否有奇环

---

## 十一、注意事项 & 常见坑点

### 常见错误 & 避坑指南

| 坑点 | 正确做法 |
|---|---|
| 数组开太小 | 普通开 4n，可持久化开 `n << 5`（约 32n） |
| 叶子节点继续递归 | build 到叶子时一定要 `return` |
| 忘记 `pushdown` | `query` 和 `update` 进入子节点前都要 `pushdown` |
| 乘法标记未初始化 | `mul[p]` 初始化为 1，不是 0 |
| 多标记顺序错误 | 先乘后加，否则标记信息会混乱 |
| 加法标记用 `int` 溢出 | 使用 `long long` 存储区间和与懒标记 |
| 区间查询的判断条件 | 用 `l <= m` 和 `r > m`，注意 `m = (s+t) >> 1` |
| 势能分析递归过深 | 检查是否遗漏 `mx <= 1` 或 `mx < m` 等剪枝条件 |
| 优化建图点数估算 | 8n 个节点，边数 `O(n + q log n)`，开数组时务必算清 |
| 线段树分治撤销顺序 | 撤销时必须严格逆序，且可撤销数据结构需支持回溯到快照 |
| 线段树分治空间 | 每个操作挂载到 `O(log T)` 个节点，总存储 `O(m log T)` |

---

## 十二、总结

### 总结

| 要素 | 内容 |
|---|---|
| 核心思想 | 二叉树维护区间信息，`O(log n)` 修改和查询 |
| 关键技巧 | Lazy Tag 延迟更新、标记下传、`pushup` / `pushdown` |
| 进阶方向 | 动态开点 → 权值线段树 → 可持久化 → 合并/分裂 → 势能分析 |
| 建图优化 | 线段树优化建图将区间连边降为 `O(log n)` |
| 离线分治 | 线段树分治将时间维度的动态问题离线静态化 |

