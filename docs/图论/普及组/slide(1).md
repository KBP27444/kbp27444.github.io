# 普及组树与图

遍历、连通、路径与基础模型

2026.08.04

---

## 1 总览

---

### 从线性结构到关系结构

栈、队列、向量维护的是“一条线”上的元素。

树与图维护的是元素之间的关系：

- 点：对象、状态、格子、任务、城市。
- 边：相邻、可达、限制、代价、依赖。
- 路径：从一个点走到另一个点的过程。
- 连通块：彼此能互相到达的一组点。

图论的第一步不是套模板，而是看清点和边分别代表什么。

---

### 本节路线

| 模块 | 核心能力 | 常用工具 |
|------|----------|----------|
| 图的基础 | 把关系存下来 | 邻接矩阵、邻接表 |
| DFS | 沿一条路走到底再回退 | 递归、栈、回溯 |
| BFS | 按层扩展最短步数 | 队列、距离数组 |
| 树 | 利用无环和路径唯一 | 父亲、深度、子树 |
| 路径问题 | 快速处理两点关系 | LCA、直径 |
| 图上模型 | 依赖、染色、最短、连通 | 拓扑、二分图、Dijkstra、Kruskal |

---

### 两类最基本的问题

树与图入门阶段，最常见的是两类问题。

可达性：
- 能不能从 s 到 t？
- 图分成几个连通块？
- 哪些格子能被访问？

路径长度：
- 最少走几步？
- 经过边权后的最小代价是多少？
- 树上两点距离是多少？

搜索负责找可达范围，路径算法负责找最优距离。

---

### 图题的读题顺序

读图题时可以按四步拆：

1. 点是什么？
2. 边是什么？
3. 方向和边权是什么？
4. 目标是遍历、计数、判定，还是求最优？

如果图没有直接给出，往往要自己建图。例如网格图中，每个格子是点，相邻可走格子之间有边。

---

### 常见复杂度

| 算法 | 适用场景 | 复杂度 |
|------|----------|--------|
| DFS / BFS | 遍历图、连通性 | O(n+m) |
| BFS 最短路 | 无权图最短步数 | O(n+m) |
| 拓扑排序 | DAG 依赖顺序 | O(n+m) |
| Dijkstra | 非负边权最短路 | O(m log n) |
| Kruskal | 最小生成树 | O(m log m) |

n 是点数，m 是边数。

---

### 容器与图算法

上一节的容器会在图论中反复出现：

| 容器 | 在图中做什么 | 典型位置 |
|------|--------------|----------|
| vector | 保存邻接表、路径、边集 | 建图 |
| stack | 保存回溯路径或手写 DFS | DFS |
| queue | 按层扩展点 | BFS、拓扑排序 |
| priority_queue | 取当前距离最小的点 | Dijkstra |
| 并查集 | 维护连通块 | Kruskal、离线连通 |

图算法本质上是在合适的容器里推进点和边。

---

## 2 图的基础与存储

---

### 图由点和边组成

图通常写作 G = (V, E)。

- V 是点集。
- E 是边集。
- 无向边表示两点可以互相到达。
- 有向边表示只能按箭头方向走。
- 带权边还带有距离、代价或时间。

很多题给的是关系表，本质上就是在描述边。

---

### 无向图与有向图

无向图：

边 {u, v} 可以从 u 到 v，也可以从 v 到 u。建邻接表时通常加两次。

有向图：

边 u → v 只能从 u 走到 v。反向不一定存在。方向会直接影响连通性和搜索结果。

---

### 度数

无向图中，点的度数是与它相连的边数。

有向图中要分开看：
- 入度：有多少条边指向它。
- 出度：有多少条边从它出发。

入度在拓扑排序中很重要。度数也常用来判断叶子、中心、端点和特殊结构。

---

### 路径、环与连通

路径是一串相邻点：v0, v1, ..., vk

如果起点和终点相同，并且中间形成闭合结构，就是环。

无向图中：
- 任意两点之间都能互相到达，图连通。
- 一个图可以分成多个连通块。

搜索能把一个连通块一次走完。

---

### 树是一种特殊图

树是无环连通图。

它有几个等价性质：

- n 个点恰好有 n-1 条边。
- 任意两点之间路径唯一。
- 删除任意一条边都会不连通。
- 加入任意一条新边都会形成环。

树题的许多做法都来自“路径唯一”。

---

### 存图方法一：邻接矩阵

邻接矩阵用二维数组保存边。

```cpp
bool a[N][N];

a[u][v] = true;
a[v][u] = true; // 无向图
```

优点：

- 判断两点是否有边是 O(1)。

缺点：

- 空间是 O(n²)。
- 点数大时不适合。

---

### 存图方法二：邻接表

邻接表只保存真实存在的边。

```cpp
vector<int> g[N];

void add_edge(int u, int v) {
    g[u].push_back(v);
    g[v].push_back(u); // 无向图
}
```

空间是 O(n+m)。大多数图题优先使用邻接表。

---

### 带权邻接表：边的结构

边有权值时，把邻点和边权一起存。

```cpp
struct Edge {
    int v, w;
};

vector<Edge> g[N];

g[u].push_back({v, w});
g[v].push_back({u, w});
```

无向带权边依然要保存两个方向。v是邻点，w是从当前点走过去的代价。

---

### 带权邻接表：遍历边

遍历时：

```cpp
for (auto e : g[u]) {
    int v = e.v, w = e.w;
}
```

如果用 pair<int,int>，通常写成：

```cpp
for (auto [v, w] : g[u]) {
    // ...
}
```

---

### 数组邻接表：建边

边很多时，也可以用数组模拟链表。

```cpp
int head[N], to[M], nxt[M], tot;

void add_edge(int u, int v) {
    to[++tot] = v;
    nxt[tot] = head[u];
    head[u] = tot;
}
```

head[u] 保存第一条边的编号。每条边通过 nxt 指向同一起点的下一条边。

---

### 数组邻接表：遍历

遍历 u 的所有出边：

```cpp
for (int i = head[u]; i; i = nxt[i]) {
    int v = to[i];
}
```

这就是用数组实现的链表。

它比 vector 写法更固定，但下标和数组大小要格外仔细。

---

### 无向图要加两条边

无向边 {u, v} 在邻接表中通常表示成两条有向边：

```cpp
add_edge(u, v);
add_edge(v, u);
```

如果每条边有编号，常见技巧是：

- 第 2k 与 2k+1 条边互为反向边。
- 用 i ^ 1 找反向边。

入门阶段可以先用 vector 邻接表，代码更直观。

---

### 图的遍历框架

邻接表建好后，遍历的基本形式很固定：

```cpp
for (int v : g[u]) {
    if (!vis[v]) {
        vis[v] = true;
        // 处理 v
    }
}
```

区别只在于：

- DFS 立刻递归到 v。
- BFS 把 v 放进队列。

---

### 建图小结

建图时最常见的错误：
- 无向图忘记加反向边。
- 点的编号从 0 还是 1 混乱。
- 数组大小没有按边数开够。
- 边权和邻点位置写反。
- 多组数据忘记清空邻接表。

存图正确，后面的搜索才有意义。

---

## 3 DFS 深度优先搜索

---

### DFS：先走到底，再回退

DFS会从当前点出发，沿着一条路尽量往深处走。

如果走不动了，就回到上一个点，换另一条边继续。

它适合：

- 遍历整张图。
- 找连通块。
- 处理树的父子关系。
- 回溯枚举方案。

DFS的核心动作是“进入”和“退出”。

---

### DFS 模板：图遍历

```cpp
void dfs(int u) {
    vis[u] = true;
    for (int v : g[u]) {
        if (!vis[v]) dfs(v);
    }
}
```

若图不一定连通，需要从每个未访问点开始：

```cpp
for (int i = 1; i <= n; i++)
    if (!vis[i]) dfs(i);
```

---

### 连通块计数

每次从一个未访问点开始 DFS，就能走完整个连通块。

```cpp
int cnt = 0;
for (int i = 1; i <= n; i++) {
    if (!vis[i]) {
        cnt++;
        dfs(i);
    }
}
```

cnt 就是连通块个数。

网格中的“有几个区域”也常用这个方法。

---

### DFS中记录父亲

树上 DFS 经常需要避免走回父亲。

```cpp
void dfs(int u, int fa) {
    for (int v : g[u]) {
        if (v == fa) continue;
        dfs(v, u);
    }
}
```

在树中，除了父亲以外，每个相邻点都是儿子。这让无根树变成以某个点为根的有根树。

---

### DFS求深度和父亲

```cpp
void dfs(int u, int fa) {
    parent[u] = fa;
    depth[u] = depth[fa] + 1;
    for (int v : g[u]) {
        if (v == fa) continue;
        dfs(v, u);
    }
}
```

parent 与 depth 是树上路径问题的基础。后面的 LCA、直径、子树大小都会用到这些量。

---

### DFS求子树大小

```cpp
void dfs(int u, int fa) {
    size[u] = 1;
    for (int v : g[u]) {
        if (v == fa) continue;
        dfs(v, u);
        size[u] += size[v];
    }
}
```

size[u] 表示以 u 为根的子树有多少个点。子树大小常用于重心、贡献统计、树形 DP。

---

### 进入与退出

DFS 有两个关键时刻：
- 进入节点：记录路径上的新信息。
- 退出节点：撤销刚才加入的信息。

这种结构适合栈和回溯。

例如括号树、路径颜色、搜索排列，都需要在递归返回时恢复现场。如果忘记撤销，其他分支会被污染。

---

### DFS序

进入节点时给它一个时间戳：

```cpp
dfn[u] = ++timer;
```

整棵子树在DFS序中是一段连续区间。因此子树问题可以转成序列问题：

- 子树加。
- 子树求和。
- 子树统计颜色。

这是树上问题常见的降维方式。

---

### 网格DFS

网格图中，每个格子最多向四个方向走。

```cpp
int dx[4] = {1, -1, 0, 0};
int dy[4] = {0, 0, 1, -1};

void dfs(int x, int y) {
    vis[x][y] = true;
    for (int k = 0; k < 4; k++) {
        int nx = x + dx[k], ny = y + dy[k];
        // 判断边界、障碍、访问标记
    }
}
```

---

### 网格DFS判断

```cpp
if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;
if (vis[nx][ny]) continue;
if (a[nx][ny] == '#') continue;
dfs(nx, ny);
```

网格题最容易错在三处：

- 边界。
- 障碍。
- 是否已经访问。

---

### 递归深度

DFS 递归很自然，但路径太长时可能栈溢出。

常见处理：

- 数据规模较小时直接递归。
- 数据规模很大时改成手写栈。
- C++ 本地测试可以留意递归深度。

普及组题里，递归 DFS 是最常用的写法。

---

### 手写栈DFS

```cpp
stack<int> st;
st.push(s);
vis[s] = true;

while (!st.empty()) {
    int u = st.top();
    st.pop();
    for (int v : g[u]) if (!vis[v]) {
        vis[v] = true;
        st.push(v);
    }
}
```

手写栈不会自动处理“退出节点”动作。如果需要回溯撤销，递归更清晰。

---

### DFS小结

DFS 的关键词：

- 深入。
- 回退。
- 递归。
- 父子关系。
- 子树信息。

看到树、连通块、区域计数、回溯枚举，可以先想 DFS。

---

## 4 BFS 广度优先搜索

---

### BFS：一层一层扩展

BFS 从起点开始，先访问距离为 1 的点，再访问距离为 2 的点。

它依赖队列：

- 新访问的点入队。
- 队首点先被扩展。
- 每个点第一次入队时得到最短步数。

无权图最短路首选 BFS。

---

### BFS模板

```cpp
queue<int> q;
fill(dist, dist + n + 1, -1);

dist[s] = 0;
q.push(s);

while (!q.empty()) {
    int u = q.front();
    q.pop();
    for (int v : g[u]) {
        if (dist[v] == -1) {
            dist[v] = dist[u] + 1;
            q.push(v);
        }
    }
}
```

---

### 为什么第一次到达就是最短

BFS 按距离分层。

队列中较早进入的点，距离一定不比后进入的点大。

当一个点第一次被访问：

- 它来自上一层。
- 更短的路径如果存在，应该已经更早访问过它。

所以无权图中第一次到达就是最短步数。

---

### 网格BFS

网格 BFS 与图 BFS 完全一样，只是邻点由方向数组生成。

```cpp
queue<pair<int,int>> q;
dist[sx][sy] = 0;
q.push({sx, sy});
```

扩展格子时检查：

是否越界。是否是障碍。是否访问过。

---

### 网格BFS核心

```cpp
auto [x, y] = q.front();
q.pop();

for (int k = 0; k < 4; k++) {
    int nx = x + dx[k], ny = y + dy[k];
    if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;
    if (wall[nx][ny] || dist[nx][ny] != -1) continue;
    dist[nx][ny] = dist[x][y] + 1;
    q.push({nx, ny});
}
```

---

### 多源BFS

如果有多个起点，可以把它们一起入队。

```cpp
for (auto s : starts) {
    dist[s] = 0;
    q.push(s);
}
```

这样每个点得到的是到最近起点的最短距离。

常见场景：

- 多个火源扩散。
- 多个出口。
- 多个目标反向出发。

---

### 0-1 BFS

如果边权只有 0 和 1，可以用双端队列。

- 走 0 边：放到队首。
- 走 1 边：放到队尾。

```cpp
deque<int> dq;
```

它比 Dijkstra 更轻，适合“免费操作”和“付费操作”混合的题。普及阶段先掌握普通 BFS，再看 0-1 BFS 会更顺。

---

### BFS 与 DFS 的区别

| 比较 | DFS | BFS |
|------|-----|-----|
| 推进方式 | 一条路走到底 | 一层一层扩展 |
| 常用容器 | 递归栈 / stack | queue |
| 擅长 | 子树、连通块、回溯 | 无权最短路、层次 |
| 距离意义 | 不保证最短 | 第一次到达最短 |

二者都能遍历图，但用途不同。

---

### BFS小结

BFS 的关键词：

- 队列。
- 层次。
- 第一次到达。
- 无权最短路。
- 多源扩散。

如果题目问“最少几步”，先判断能否建成无权图，再考虑 BFS。

---

## 5 树的基础

---

### 树的五个基本量

把无根树选定一个根之后，就能得到：

- fa[u]：父亲。
- dep[u]：深度。
- siz[u]：子树大小。
- son[u]：儿子。
- dist[u]：到根的距离。

这些量都可以由一次DFS得到。

---

### 根的选择

树本身没有固定根。很多题会人为选一个根，例如 1。

选根后：
- 边有了父子方向。
- 子树概念变得明确。
- 根到点的路径可以作为前缀。

不同根可能让题目更简单，但入门阶段常先选 1。

---

### 树上路径唯一

树上任意两点之间只有一条简单路径。

这带来很多简化：
- 不需要在多条路中选择。
- 路径可以用 LCA 拆成两段。
- 边被删除后，连通块大小可以由子树大小得到。

图中路径可能很多，树中路径唯一。

---

### 树的遍历

DFS 遍历树时，父亲用于阻止回头。

```cpp
void dfs(int u, int fa) {
    for (int v : g[u]) {
        if (v == fa) continue;
        dfs(v, u);
    }
}
```

如果需要字典遍历，可以先对每个邻接表排序。

```cpp
sort(g[u].begin(), g[u].end());
```

---

### 二叉树

二叉树中每个节点最多有两个儿子。

常见遍历：

- 前序：根、左、右。
- 中序：左、根、右。
- 后序：左、右、根。

表达式树、线段树、堆，都可以看成特殊的树结构。

---

### 二叉树深度

```cpp
int depth(int u) {
    if (u == 0) return 0;
    return max(depth(lson[u]), depth(rson[u])) + 1;
}
```

每个节点的深度由左右子树深度决定。这是树形递归最基础的形式。

---

### 树的直径

树的直径是树上最长的简单路径。

常用求法：
1. 从任意点出发，找最远点 a。
2. 从 a 出发，找最远点 b。
3. a 到 b 的距离就是直径长度。

两次 DFS 或 BFS 都可以。

---

### 直径模板：找最远点

```cpp
void dfs(int u, int fa, int d) {
    if (d > best_dist) {
        best_dist = d;
        best = u;
    }
    for (auto [v, w] : g[u]) {
        if (v == fa) continue;
        dfs(v, u, d + w);
    }
}
```

无权树可以把每条边权看成 1。

---

### 树上距离

如果边无权：

dist(u,v) = dep[u] + dep[v] - 2 * dep[lca(u,v)]

如果边带权：

dist(u,v) = dis[u] + dis[v] - 2 * dis[lca(u,v)]

这里 dis[u] 是根到 u 的距离。

关键在于快速求 LCA。

---

### LCA：最近公共祖先

两个点的LCA，是它们从根出发路径上的最后一个公共点。

用途：

- 求树上两点距离。
- 判断路径关系。
- 做树上差分。
- 统计路径经过次数。

入门阶段先掌握倍增LCA。

---

### 倍增思想

up[u][k] 表示从 u 往上跳 2^k 步到达的祖先。

例如：
- up[u][0] 是父亲。
- up[u][1] 是爷爷。
- up[u][2] 是往上 4 步的祖先。

大跳由小跳合成：up[u][k] = up[ up[u][k-1] ][k-1]

---

### 倍增预处理

```cpp
void dfs(int u, int fa) {
    up[u][0] = fa;
    dep[u] = dep[fa] + 1;
    for (int k = 1; k < LOG; k++)
        up[u][k] = up[up[u][k - 1]][k - 1];
    for (int v : g[u]) if (v != fa)
        dfs(v, u);
}
```

预处理一次，后面每次查询只要 O(log n)。

---

### LCA 查询第一步

先把两个点跳到同一深度。

```cpp
if (dep[u] < dep[v]) swap(u, v);

for (int k = LOG - 1; k >= 0; k--) {
    if (dep[up[u][k]] >= dep[v]) {
        u = up[u][k];
    }
}
```

如果此时 u == v，答案就是它。

---

### LCA 查询第二步

同时往上跳，直到父亲相同。

```cpp
if (u == v) return u;

for (int k = LOG - 1; k >= 0; k--) {
    if (up[u][k] != up[v][k]) {
        u = up[u][k];
        v = up[v][k];
    }
}
return up[u][0];
```

---

### 树上差分入门

如果多次给路径加一，不能每次沿路径暴力走。

点差分常用打标：
- cnt[u]++
- cnt[v]++
- cnt[lca]--
- cnt[parent[lca]]--

最后从下往上累加。每个点累加后的值就是被多少条路径经过。

---

### 差分回收

```cpp
void collect(int u, int fa) {
    for (int v : g[u]) {
        if (v == fa) continue;
        collect(v, u);
        cnt[u] += cnt[v];
    }
}
```

树上差分把路径操作转成端点操作。这一维差分的“端点打标”思想很像。

---

### 树的重心

树的重心是删除它后，最大连通块尽量小的点。

求法：
- DFS 得到每个子树大小。
- 对点 u，最大连通块来自某个儿子子树，或父亲方向的剩余部分。
- 取最大值最小的点。

重心常用于树的平衡分治，也常作为树结构题的基础性质。

---

### 树的基础小结

树题常见处理顺序：
1. 建邻接表。
2. 选根。
3. DFS 求父亲、深度、子树大小。
4. 根据路径或子树目标选择 LCA、DFS 序、差分或 DP。

先把基础量算稳，后面的题会轻很多。

---

## 6 图上的常见模型

---

### 拓扑排序：处理依赖关系

DAG 是没有有向环的有向图。

拓扑序满足：

如果有边 u → v，那么 u 必须排在 v 前面。

常见含义：

- 任务先后关系。
- 课程依赖。
- 工序约束。
- DAG 上 DP 的计算顺序。

---

### 拓扑排序模板

```cpp
queue<int> q;
for (int i = 1; i <= n; i++)
    if (indeg[i] == 0) q.push(i);

while (!q.empty()) {
    int u = q.front();
    q.pop();
    order.push_back(u);
    for (int v : g[u]) {
        if (--indeg[v] == 0) q.push(v);
    }
}
```

若 order.size() < n，说明有环。

---

### DAG上DP

拓扑序让所有前驱先被计算。

```cpp
for (int u : order) {
    for (int v : g[u]) {
        dp[v] = max(dp[v], dp[u] + w(u, v));
    }
}
```

适合：

- 最长路。
- 路径条数。
- 食物链计数。
- 任务最早完成时间。

---

### 二分图染色

二分图可以把点分成左右两侧，同一侧内部没有边。

用两种颜色DFS或BFS：

- 未染色点染成0。
- 相邻点染成相反颜色。
- 如果发现相邻点颜色相同，说明不是二分图。

奇环会破坏二分图。

---

### 染色模板

```cpp
bool dfs(int u, int c) {
    color[u] = c;
    for (int v : g[u]) {
        if (color[v] == -1) {
            if (!dfs(v, c ^ 1)) return false;
        } else if (color[v] == c) {
            return false;
        }
    }
    return true;
}
```

图不连通时，每个未染色点都要作为新起点。

---

### 并查集维护连通块

并查集支持：

- 查询两个点是否在同一集合。
- 合并两个集合。

图上常见用途：

- 动态加边后的连通性。
- Kruskal 最小生成树。
- 反向处理删边。

它只维护连通关系，不维护路径长度。

---

### 并查集模板

```cpp
int find(int x) {
    if (fa[x] == x) return x;
    return fa[x] = find(fa[x]);
}

void unite(int x, int y) {
    x = find(x), y = find(y);
    if (x != y) fa[x] = y;
}
```

初始化：

```cpp
for (int i = 1; i <= n; i++) fa[i] = i;
```

---

### Dijkstra：带非负边权的最短路

当边权不是1，而是非负数时，BFS 不再够用。

Dijkstra 每次取当前距离最小的点扩展。

核心状态：

- dis[u]：到 u 的最短距离。
- 优先队列中保存 {距离, 点}。
- 旧状态出队时跳过。

---

### Dijkstra模板

```cpp
using P = pair<long long, int>;
priority_queue<P, vector<P>, greater<P>> pq;

fill(dis, dis + n + 1, INF);
dis[s] = 0;
pq.push({0, s});

while (!pq.empty()) {
    auto [d, u] = pq.top();
    pq.pop();
    if (d != dis[u]) continue;
    // 松弛 u 的出边
}
```

---

### Dijkstra松弛边

```cpp
for (auto [v, w] : g[u]) {
    if (dis[v] > dis[u] + w) {
        dis[v] = dis[u] + w;
        pq.push({dis[v], v});
    }
}
```

边权必须非负。如果有负边，Dijkstra的贪心顺序会失效。

---

### Floyd：小图全源最短路

如果点数较小，并且要查询任意两点最短路，可以用 Floyd。

```cpp
for (int k = 1; k <= n; k++)
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
```

复杂度是 O(n³)。适合点数较小的题。

---

### 最小生成树

生成树是保留所有点连通的一棵树。最小生成树要求边权总和最小。

Kruskal 的思路：
1. 按边权从小到大排序。
2. 如果一条边连接两个不同连通块，就选它。
3. 用并查集维护连通块。

最后选中 n-1 条边。

---

### Kruskal模板

```cpp
struct Edge { int u, v, w; };
vector<Edge> edges;

sort(edges.begin(), edges.end(),
     [](Edge a, Edge b) { return a.w < b.w; });

long long ans = 0;
for (auto e : edges) {
    if (find(e.u) != find(e.v)) {
        unite(e.u, e.v);
        ans += e.w;
    }
}
```

---

### 连通性与反向处理

如果题目不断删边，直接维护会比较麻烦。

常见转化：

- 先把最终剩下的边加入并查集。
- 把删边操作倒过来看成加边。
- 每次加边后维护连通块数量。

删除不好做时，反向加回来常常更容易。

---

### 图上模型小结

常见图模型可以这样选：

| 目标 | 常用算法 | 核心容器 |
|------|----------|----------|
| 遍历可达 | DFS / BFS | 栈 / 队列 |
| 无权最短路 | BFS | 队列 |
| 非负权最短路 | Dijkstra | 优先队列 |
| 依赖顺序 | 拓扑排序 | 队列 |
| 维护连通 | 并查集 | 父亲数组 |
| 连通代价最小 | Kruskal | 并查集 + 排序 |

---

## 7 综合识别

---

### 如何从题意识别图

很多题没有直接给出“图”这个词。这些描述也常常是在建图：

- 两个状态可以互相转移。
- 一个任务必须在另一个任务之后。
- 一个格子可以走到相邻格子。
- 两个对象不能放在同一侧。
- 两个城市之间有道路和费用。

把“关系”抽象出来，图就出现了。

---

### 搜索题的稳定流程

1. 确定状态。
2. 确定从状态能走到哪些新状态。
3. 选择DFS或BFS。
4. 设置vis或dist防止重复。
5. 在访问时更新答案。

如果问可达范围，用DFS/BFS。如果问最少步数，优先BFS。

---

### 树题的稳定流程

1. 建无向邻接表。
2. 选根。
3. DFS 求基础量。
4. 判断目标是子树、路径还是整棵树。
5. 用DFS序、LCA、直径、差分或树形DP。

树的优势是路径唯一。许多看似复杂的路径题，最后都会落到LCA或一次DFS。

---

### 建模与模板的关系

模板负责稳定地执行算法。

建模负责决定：

- 点是什么。
- 边是什么。
- 是否带权。
- 是否有方向。
- 起点和终点是什么。

模板背熟之后，真正决定成败的是建图。

---

### 最后一张图

| 关键词 | 优先想到 | 常见题型 |
|--------|----------|----------|
| 连通块 | DFS / BFS / 并查集 | 区域计数、道路连通 |
| 最少步数 | BFS | 迷宫、棋盘、状态转移 |
| 非负边权 | Dijkstra | 道路最短费用 |
| 依赖关系 | 拓扑排序 | 任务安排、食物链计数 |
| 树上距离 | LCA | 路径查询 |
| 连通最小代价 | Kruskal | 修路、供水、连接点 |

先识别关键词，再把题目翻译成点、边和操作。

---

## 8 练习部分

---

P3916 图的遍历
所属模块：DFS / 反图
https://www.luogu.com.cn/problem/P3916
关联知识点：反向建图、DFS、可达最大编号

P5318 【深基18.例3】查找文献
所属模块：遍历
https://www.luogu.com.cn/problem/P5318
关联知识点：DFS、BFS、邻接表排序

P1162 填涂颜色
所属模块：网格搜索
https://www.luogu.com.cn/problem/P1162
关联知识点：网格DFS、从边界出发、连通块

P1451 求细胞数量
所属模块：网格搜索
https://www.luogu.com.cn/problem/P1451
关联知识点：网格DFS、连通块计数、四方向

P1135 奇怪的电梯
所属模块：BFS
https://www.luogu.com.cn/problem/P1135
关联知识点：无权最短路、状态转移、队列

P1443 马的遍历
所属模块：BFS
https://www.luogu.com.cn/problem/P1443
关联知识点：棋盘BFS、最短步数、方向数组

P1746 离开中山路
所属模块：BFS
https://www.luogu.com.cn/problem/P1746
关联知识点：迷宫、最短路、网格图

P2296 寻找道路
所属模块：BFS / 反图
https://www.luogu.com.cn/problem/P2296
关联知识点：反向可达、删点过滤、最短路

P1144 最短路计数
所属模块：BFS / 最短路
https://www.luogu.com.cn/problem/P1144
关联知识点：无权图、最短路计数、方案数

P1330 封锁阳光大学
所属模块：二分图染色
https://www.luogu.com.cn/problem/P1330
关联知识点：染色判定、奇环、连通块取最小

P1525 [NOIP2010 提高组] 关押罪犯
所属模块：二分图 / 并查集
https://www.luogu.com.cn/problem/P1525
关联知识点：二分答案、二分图染色、关系约束

P1113 杂务
所属模块：拓扑排序
https://www.luogu.com.cn/problem/P1113
关联知识点：任务依赖、DAG最长路、入度

P1983 [NOIP2013 普及组] 车站分级
所属模块：拓扑排序
https://www.luogu.com.cn/problem/P1983
关联知识点：建图、等级约束、DAG DP

P4017 最大食物链计数
所属模块：拓扑排序
https://www.luogu.com.cn/problem/P4017
关联知识点：DAG计数、入度出度、路径条数

P1807 最长路
所属模块：拓扑 / DP
https://www.luogu.com.cn/problem/P1807
关联知识点：DAG最长路、拓扑序、动态规划

P3371 【模板】单源最短路径（弱化版）
所属模块：最短路
https://www.luogu.com.cn/problem/P3371
关联知识点：单源最短路、松弛、边权

P4779 【模板】单源最短路径（标准版）
所属模块：Dijkstra
https://www.luogu.com.cn/problem/P4779
关联知识点：优先队列、非负边权、最短路模板

P1119 灾后重建
所属模块：Floyd
https://www.luogu.com.cn/problem/P1119
关联知识点：动态加点、全源最短路、中转点

P1346 电车
所属模块：最短路建图
https://www.luogu.com.cn/problem/P1346
关联知识点：0/1边权、建图、最少切换

P3366 【模板】最小生成树
所属模块：最小生成树
https://www.luogu.com.cn/problem/P3366
关联知识点：Kruskal、并查集、排序

P1195 口袋的天空
所属模块：生成树
https://www.luogu.com.cn/problem/P1195
关联知识点：最小生成森林、连通块数量、Kruskal

P1550 [USACO08OCT] Watering Hole G
所属模块：生成树建图
https://www.luogu.com.cn/problem/P1550
关联知识点：超级源点、最小生成树、供水模型

P1197 [JSOI2008] 星球大战
所属模块：并查集
https://www.luogu.com.cn/problem/P1197
关联知识点：反向加点、动态连通、连通块

P1030 [NOIP2001 普及组] 求先序排列
所属模块：二叉树
https://www.luogu.com.cn/problem/P1030
关联知识点：中序后序、递归建树、遍历

P1305 新二叉树
所属模块：二叉树
https://www.luogu.com.cn/problem/P1305
关联知识点：前序遍历、左右儿子、递归

P4913 【深基16.例3】二叉树深度
所属模块：树的深度
https://www.luogu.com.cn/problem/P4913
关联知识点：二叉树、递归、最大深度

P3884 [JLOI2009] 二叉树问题
所属模块：树的基础
https://www.luogu.com.cn/problem/P3884
关联知识点：深度、宽度、LCA距离

P1351 [NOIP2014 提高组] 联合权值
所属模块：树上贡献
https://www.luogu.com.cn/problem/P1351
关联知识点：距离为2、邻域统计、贡献法

P3128 [USACO15DEC] Max Flow P
所属模块：树上差分
https://www.luogu.com.cn/problem/P3128
关联知识点：路径计数、LCA、点差分

P3258 [JLOI2014] 松鼠的新家
所属模块：树上差分
https://www.luogu.com.cn/problem/P3258
关联知识点：连续路径、端点修正、点计数

P3379 【模板】最近公共祖先（LCA）
所属模块：LCA
https://www.luogu.com.cn/problem/P3379
关联知识点：倍增、深度、祖先跳跃

P3398 仓鼠找 sugar
所属模块：LCA
https://www.luogu.com.cn/problem/P3398
关联知识点：路径相交、祖先关系、树上路径

P5536 【XR-3】核心城市
所属模块：树的直径
https://www.luogu.com.cn/problem/P5536
关联知识点：直径、树中心、距离

P5022 [NOIP2018 提高组] 旅行
所属模块：DFS遍历
https://www.luogu.com.cn/problem/P5022
关联知识点：字典序、树遍历、基环图

P5658 [CSP-S 2019] 括号树
所属模块：DFS回溯
https://www.luogu.com.cn/problem/P5658
关联知识点：括号匹配、路径栈、树上前缀

P7073 [CSP-J 2020] 表达式
所属模块：表达式树
https://www.luogu.com.cn/problem/P7073
关联知识点：树形结构、DFS、短路求值

P5836 [USACO19DEC] Milk Visits S
所属模块：树上路径
https://www.luogu.com.cn/problem/P5836
关联知识点：颜色连通块、LCA、路径判定

P1967 [NOIP2013 提高组] 货车运输
所属模块：生成树 + LCA
https://www.luogu.com.cn/problem/P1967
关联知识点：最大生成树、瓶颈路径、倍增

P4822 [BJWC2012] 冻结
所属模块：分层图
https://www.luogu.com.cn/problem/P4822
关联知识点：状态扩展、最短路、额外资源

P7771 【模板】欧拉路径
所属模块：欧拉路径
https://www.luogu.com.cn/problem/P7771
关联知识点：边的使用、Hierholzer、字典序