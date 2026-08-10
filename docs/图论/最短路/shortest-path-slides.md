---
marp: true
theme: default
size: 16:9
paginate: true
footer: "算法竞赛课件 · 图论"
---

<!-- _class: lead -->

# 最短路
## Shortest Path

**Floyd · Dijkstra · Bellman–Ford · SPFA · Johnson**

<!-- OI Wiki 课件 · `graph/shortest-path` -->

---

## 算法全景图

| 算法 | 类型 | 适用图 | 负环检测 | 时间复杂度 |
|------|:--:|------|:--:|------|
| **Floyd** | 全源 | 任意（无负环） | ✅ | $O(n^3)$ |
| **Dijkstra** | 单源 | **非负权** | ❌ | $O(m \log m)$ |
| **Bellman–Ford** | 单源 | 任意 | ✅ | $O(nm)$ |
| **SPFA** | 单源 | 任意 | ✅ | $O(m) \sim O(nm)$ |
| **Johnson** | 全源 | 任意（无负环） | ✅ | $O(nm \log m)$ |

> 核心权衡：**正权用 Dijkstra，负权用 Bellman–Ford/SPFA，全源小图用 Floyd，全源大图用 Johnson**

---

## 基础：松弛操作

所有最短路算法的核心操作——**松弛（Relaxation）**：

$$\text{若 } dis[v] > dis[u] + w(u,v) \text{，则 } dis[v] = dis[u] + w(u,v)$$

```cpp
// 尝试用 u 的当前距离 + 边权 来更新 v
if (dis[u] + w < dis[v]) {
    dis[v] = dis[u] + w;
}
```

**三角形不等式**：最短路一定满足
$$dis[v] \le dis[u] + w(u,v)$$

> 松弛的本质：不断用三角形不等式修正上界，直到收敛

---

<!-- _class: lead -->

## 一、Floyd 算法
### 全源最短路 · $O(n^3)$

---

## Floyd：动态规划思想

定义 $f[k][x][y]$：只允许经过节点 $\{1, 2, \ldots, k\}$ 时，$x \to y$ 的最短路。

**状态转移**：
$$f[k][x][y] = \min(f[k-1][x][y],\ f[k-1][x][k] + f[k-1][k][y])$$

两种情况：
1. **不经过 $k$**：沿用上一层 $f[k-1][x][y]$
2. **经过 $k$**：$x \to k \to y$，两段都是只经过 $\{1,\ldots,k-1\}$ 的最短路

第一维可以**压缩掉**（因为用 $k$ 更新时，$f[k][k][\cdot] = f[k-1][k][\cdot]$ 不变）：

```cpp
for (int k = 1; k <= n; k++)
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            f[i][j] = min(f[i][j], f[i][k] + f[k][j]);
```

> ⚠️ **循环顺序必须是 k → i → j**，k 放最内层是错的！

---

## Floyd：完整模板

```cpp
// 初始化
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= n; j++)
        f[i][j] = (i == j) ? 0 : INF;
// 读入边
for (int i = 0; i < m; i++) {
    int u, v, w; cin >> u >> v >> w;
    f[u][v] = min(f[u][v], w);
}
// Floyd 核心
for (int k = 1; k <= n; k++)
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            f[i][j] = min(f[i][j], f[i][k] + f[k][j]);
// 负环检测：检查对角线
for (int i = 1; i <= n; i++)
    if (f[i][i] < 0) { /* 存在负环 */ }
```

---

## Floyd 扩展 1：最小环

**问题**：求无向图中边权和最小的环。

**思路**：考虑环上**编号最大的节点 $u$**。

在 Floyd 第 $k$ 轮枚举 $i, j < k$：
$$ans = \min(ans,\ f[i][j] + w(i, k) + w(k, j))$$

---

```cpp
int ans = INF;
for (int k = 1; k <= n; k++) {
    // 先求环，再更新最短路
    for (int i = 1; i < k; i++)
        for (int j = i + 1; j < k; j++)
            ans = min(ans, f[i][j] + w[i][k] + w[k][j]);
    // Floyd 更新
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            f[i][j] = min(f[i][j], f[i][k] + f[k][j]);
}
```

> $f[i][j]$ 此时只经过 $< k$ 的节点，保证 $i,j,k$ 互异且 $k$ 是编号最大点

---

## Floyd 扩展 2：传递闭包

**问题**：判断有向图中任意两点是否可达。

将 `min` 替换为**逻辑或**，`+` 替换为**逻辑与**：

```cpp
// f[i][j] = 1 表示 i 可到达 j
for (int k = 1; k <= n; k++)
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            f[i][j] |= f[i][k] & f[k][j];
```

**bitset 优化**到 $O(n^3 / w)$：
```cpp
bitset f[N];
for (int k = 1; k <= n; k++)
    for (int i = 1; i <= n; i++)
        if (f[i][k]) f[i] |= f[k];
```

---

<!-- _class: lead -->

## 二、Dijkstra 算法
### 单源最短路 · 非负权图 · $O(m \log m)$

---

## Dijkstra：贪心思想

将节点分为两个集合：
- **S**：已确定最短路的点（闭壳）
- **T**：未确定最短路的点

**每轮操作**：
1. 从 $T$ 中选出 `dis` 最小的点 $u$，移入 $S$
2. 用 $u$ 的所有出边松弛 $T$ 中的邻居

> 核心性质：从 $T$ 中选出的 $u$，其 $dis[u]$ 已经是最终答案

---

## Dijkstra 正确性证明（反证法）

设 $u$ 是第一个从 $T$ 取出但 $dis[u] \neq D(u)$ 的点。

在真实最短路径 $s \rightsquigarrow u$ 上，找到第一个还留在 $T$ 中的节点 $y$，其前驱 $x \in S$：

1. $x \in S$ → $dis[x] = D(x)$（已正确确定）✓
2. 边 $(x,y)$ 已被松弛 → $dis[y] = D(y)$
3. 边权非负 → $D(y) \le D(u)$ → $dis[y] \le dis[u]$
4. 但 $u$ 被先选出 → $dis[u] \le dis[y]$

由 3,4 得 $dis[u] = dis[y] = D(u)$，矛盾！

> 关键不等式 $D(y) \le D(u)$ **依赖边权非负**
> 有负权边时此式不成立 → Dijkstra 失效

---

## 朴素 Dijkstra：$O(n^2)$

```cpp
int dis[N], vis[N];

void dijkstra(int s) {
    memset(dis, 0x3f, sizeof dis);
    dis[s] = 0;
    for (int i = 1; i <= n; i++) {
        // 找到 T 中 dis 最小的点
        int u = 0;
        for (int j = 1; j <= n; j++)
            if (!vis[j] && dis[j] < dis[u]) u = j;
        vis[u] = 1;
        // 松弛
        for (auto [v, w] : g[u])
            dis[v] = min(dis[v], dis[u] + w);
    }
}
```

> **适合稠密图**（$m \approx n^2$），此时 $O(n^2) < O(m \log n)$

---

## 堆优化 Dijkstra：$O(m \log m)$

```cpp
typedef long long ll;
const ll INF = 1e18;
ll dis[N];
bool vis[N];
vector<pair<int,int>> g[N];  // {v, w}

void dijkstra(int s) {
    fill(dis + 1, dis + n + 1, INF);
    // 小根堆：{距离, 节点}
    priority_queue<pair<ll,int>, vector<pair<ll,int>>, greater<>> pq;
    dis[s] = 0;
    pq.push({0, s});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (vis[u]) continue;  // 过时状态，跳过
        vis[u] = true;
        for (auto [v, w] : g[u]) {
            if (dis[u] + w < dis[v]) {
                dis[v] = dis[u] + w;
                pq.push({dis[v], v});  // 新状态入堆
            }
        }
    }
}
```

> `vis[u] = true` 发生在**弹出时**而非入堆时——同一个点可能多次入堆

---

## Dijkstra 使用要点

| 要点 | 说明 |
|------|------|
| **vis 判断时机** | 弹出时检查（`if (vis[u]) continue`），不是入堆时标记 |
| **小根堆** | C++ `priority_queue` 默认大根堆，需加 `greater<>` |
| **负权边** | ❌ 绝对不能用 Dijkstra！要用 Bellman–Ford 或 SPFA |
| **稀疏图** | 用堆优化，$O(m \log m)$ |
| **稠密图** | 用朴素，$O(n^2)$，因为 $m \approx n^2$ |

**朴素 vs 堆优化选择**：
- $m \approx n^2$（稠密）→ 朴素 $O(n^2)$
- $m \ll n^2$（稀疏）→ 堆优化 $O(m \log n)$

---

<!-- _class: lead -->

## 三、Bellman–Ford 算法
### 单源最短路 · 支持负权边 · $O(nm)$

---

## Bellman–Ford：全边松弛

**核心思想**：对**所有边**执行 $n-1$ 轮松弛。

**为什么是 $n-1$ 轮？**
最短路最多包含 $n-1$ 条边。每轮至少让松弛成功边的对应端点正确。

```cpp
struct Edge { int u, v, w; };
vector edges;

bool bellmanFord(int s) {
    memset(dis, 0x3f, sizeof dis);
    dis[s] = 0;
    bool flag = false;
    for (int i = 1; i <= n; i++) {
        flag = false;
        for (auto [u, v, w] : edges) {
            if (dis[u] == INF) continue;
            if (dis[u] + w < dis[v]) {
                dis[v] = dis[u] + w;
                flag = true;
            }
        }
        if (!flag) break;  // 提前终止优化
    }
    return flag;  // true = 第 n 轮仍松弛 → 存在可达负环
}
```

---

## Bellman–Ford 特殊应用：限制边数

**问题**：求最多经过 $k$ 条边的最短路。

```cpp
int dis[N], backup[N];

int bellmanFord(int s, int k) {
    memset(dis, 0x3f, sizeof dis);
    dis[s] = 0;
    for (int i = 0; i < k; i++) {
        memcpy(backup, dis, sizeof dis);  // 必须备份！
        for (auto [u, v, w] : edges) {
            if (backup[u] == INF) continue;
            dis[v] = min(dis[v], backup[u] + w);
        }
    }
    return dis[n];  // 注意用 INF/2 判断不可达
}
```

> 用 `backup` 防止本轮的更新被串联使用，确保每条路径最多用 $k$ 条边

---

<!-- _class: lead -->

## 四、SPFA 算法
### Bellman–Ford 的队列优化

---

## SPFA：只有被松弛的节点才有用

Bellman–Ford 每轮扫描全部边，很多是浪费的。SPFA 用队列只维护**可能引起松弛**的节点。

```
被松弛 → 入队 → 出队时用它的出边松弛 → 被松弛者再次入队 → ...
```

---

```cpp
int dis[N], cnt[N];  // cnt[i] = 到 i 的最短路经过的边数
bool inq[N];          // 是否在队列中

bool spfa(int s) {
    memset(dis, 0x3f, sizeof dis);
    dis[s] = 0; inq[s] = true;
    queue q; q.push(s);

    while (!q.empty()) {
        int u = q.front(); q.pop();
        inq[u] = false;
        for (auto [v, w] : g[u]) {
            if (dis[u] + w < dis[v]) {     // 松弛成功
                dis[v] = dis[u] + w;
                cnt[v] = cnt[u] + 1;
                if (cnt[v] >= n) return false;  // 负环！
                if (!inq[v]) {
                    q.push(v);
                    inq[v] = true;
                }
            }
        }
    }
    return true;  // 无负环
}
```

---

## SPFA 判负环 + 全部负环检测

**判负环**：记录 `cnt[v]` = 到 $v$ 的最短路边数。
- 正常情况下 `cnt[v] ≤ n-1`
- 若 `cnt[v] ≥ n` → 路径经过了超过 $n-1$ 条边 → **存在负环**

**检测整张图的负环（不只是从 $s$ 出发）**：
```cpp
// 将所有点初始入队
for (int i = 1; i <= n; i++) {
    q.push(i);
    inq[i] = true;
}
```

---

**SPFA 的优化**：SLF（Small Label First，小的插队首）、LLL（Large Label Last，大的插队尾）。

> ⚠️ SPFA 平均快但最坏 $O(nm)$，可能被出题人卡掉。正权图请用 Dijkstra！

---

## Dijkstra vs SPFA 关键区别

| | Dijkstra | SPFA |
|------|:--:|:---:|
| **数据结构** | 优先队列 | 普通队列 |
| **每个点确定时机** | 弹出一次即确定 | 可多次入队/出队 |
| **vis/inq 含义** | `vis=true` 不会再改 | `inq=true` 仅在队中防重复 |
| **边权要求** | 必须非负 | 任意 |
| **复杂度** | 稳定 $O(m \log m)$ | 不稳定，可被卡 |

```cpp
// Dijkstra:
vis[u] = true;  // 弹出即确定，不再入队

// SPFA:
inq[u] = false;  // 出队后还可能再入队！
```

---

<!-- _class: lead -->

## 五、Johnson 算法
### 全源最短路 · 支持负权边 · $O(nm \log m)$

---

## Johnson：用势能消灭负权边

**问题**：想对每个点跑 Dijkstra 求全源最短路，但图有负权边。

**错误做法**：给所有边加上同一个正数 $x$。不同路径的边数不同，加常数会改变最短路！

**正确做法——势能法**：
1. 添加虚拟节点 $0$，向所有点连边权为 $0$ 的边
2. 跑 Bellman–Ford/SPFA，得到每个点的**势能** $h_i$
3. 重新标定边权：$w'(u,v) = w(u,v) + h_u - h_v$
4. 此时**所有 $w' \ge 0$**（由三角不等式保证）
5. 跑 $n$ 次 Dijkstra
6. 还原：$dist(u,v) = dist'(u,v) - h_u + h_v$

---

## Johnson：为什么势能法正确

**势能与非负性**：

$$h_v \le h_u + w(u,v) \quad \text{（SPFA 后满足三角不等式）}$$

$$\Rightarrow w'(u,v) = w(u,v) + h_u - h_v \ge 0$$

**路径长度还原**：
对于任意 $s \rightsquigarrow t$ 路径：
$$\sum w' = \sum (w + h_u - h_v) = \sum w + h_s - h_t$$

$h_s - h_t$ 与路径无关，因此新图最短路 $\iff$ 原图最短路。

> 本质上，$h_i$ 类似于物理中的"势能"，$h_s - h_t$ 是端点差异，不影响路径选择

---

## Johnson：算法框架

```cpp
// 步骤 1：添加虚点 0 连所有点
for (int i = 1; i <= n; i++) add(0, i, 0);

// 步骤 2：SPFA 求势能 h[i] + 判负环
if (spfa(0)) { /* 存在负环，无解 */ return; }

// 步骤 3：重新标定边权（直接修改或现场计算）
for (int u = 1; u <= n; u++)
    for (auto& [v, w] : g[u])
        w = w + h[u] - h[v];

// 步骤 4：对每个点跑 Dijkstra
for (int u = 1; u <= n; u++) {
    dijkstra(u);
    for (int v = 1; v <= n; v++)
        realDis[u][v] = dis[v] - h[u] + h[v];  // 还原
}
```

---

复杂度 $O(nm + n \cdot m \log m) = O(nm \log m)$

---

<!-- _class: lead -->

## 六、差分约束系统

---

## 差分约束：最短路的重要应用

**问题**：求解形如 $x_i - x_j \le c$ 的不等式组。

**核心转化**：
$$x_i - x_j \le c \quad \Longleftrightarrow \quad x_i \le x_j + c$$

这恰好是**最短路的三角不等式**！→ 从 $j$ 向 $i$ 连边权为 $c$ 的边。

| 原不等式 | 转化 | 建边 |
|----------|------|:---:|
| $x_a - x_b \le c$ | — | `add(b, a, c)` |
| $x_a - x_b \ge c$ | $x_b - x_a \le -c$ | `add(a, b, -c)` |
| $x_a - x_b = c$ | 两个 ≤ | `add(b,a,c)`, `add(a,b,-c)` |
| $x_a - x_b < c$（整数）| $x_a - x_b \le c-1$ | `add(b, a, c-1)` |

---

## 差分约束：求解步骤

1. 按规则建图
2. 添加**超级源点** $S$，向所有点连边权为 $0$ 的边
3. 跑 Bellman–Ford 或 SPFA

- **存在负环** → 不等式组**无解**
- **无负环** → $dis[i]$ 是**一组可行解**（且 $dis[i] + d$ 也是，$d$ 为任意常数）

**经典例题**：
| 题号 | 名称 | 考点 |
|:----:|------|------|
| P5960 | 【模板】差分约束 | 标准模板 |
| P1993 | 小 K 的农场 | 三种约束条件 |
| P4926 | [1007] 倍杀测量者 | 差分约束 + 二分 |

---

<!-- _class: lead -->

## 七、算法选择与总结

---

## 选型决策树

```
全源还是单源？
│
├── 全源
│   ├── n ≤ 500          → Floyd O(n³)
│   └── n > 500, 有大负权 → Johnson O(nm log m)
│
└── 单源
    ├── 边权全 ≥ 0
    │   ├── 稠密图 m ≈ n²  → 朴素 Dijkstra O(n²)
    │   └── 稀疏图 m ≪ n²  → 堆优化 Dijkstra O(m log m)
    │
    └── 有负权边
        ├── 需限制边数     → Bellman-Ford O(nm)
        └── 不限制边数     → SPFA（注意被卡风险）
```

---

## 五大算法对比

| 算法 | 类型 | 边权 | 时间复杂度 | 负环 | 核心技巧 |
|------|:--:|:--:|------|:--:|------|
| **Floyd** | 全源 | 任意 | $O(n^3)$ | ✅ | DP, 枚举中转点 |
| **Dijkstra** | 单源 | $\ge 0$ | $O(m \log m)$ | ❌ | 贪心, 优先队列 |
| **Bellman–Ford** | 单源 | 任意 | $O(nm)$ | ✅ | $n-1$ 轮全边松弛 |
| **SPFA** | 单源 | 任意 | $O(m) \sim O(nm)$ | ✅ | 队列优化 BF |
| **Johnson** | 全源 | 任意 | $O(nm \log m)$ | ✅ | 势能 + Dijkstra |

---

## 各算法模板题

| 题号 | 名称 | 算法 | 说明 |
|:----:|------|:----:|------|
| B3647 | 【模板】Floyd | Floyd | 全源最短路 |
| P3371 | 单源最短路径（弱化） | Dijkstra | 朴素可过 |
| P4779 | 单源最短路径（标准） | Dijkstra | 必须堆优化 |
| P3385 | 【模板】负环 | SPFA/BF | 负环检测 |
| P5905 | 【模板】Johnson | Johnson | 全源含负权 |
| P5960 | 【模板】差分约束 | SPFA | 差分约束入门 |

---

## 核心要点回顾

1. **松弛操作**是所有最短路算法的基石：$dis[v] = \min(dis[v], dis[u] + w)$
2. **Dijkstra** 正确性依赖边权非负——有负权时用 **Bellman–Ford** 或 **SPFA**
3. **SPFA** 平均很快但最坏 $O(nm)$，竞赛中注意被卡风险
4. **Floyd** 循环顺序 `k → i → j` 不能变；可扩展做最小环和传递闭包
5. **Johnson** 用势能函数消灭负权边，使 Dijkstra 可用——体现了"重新标号"的技巧
6. **差分约束**本质是最短路：$x_i - x_j \le c \iff$ 建边 $j \xrightarrow{c} i$

> 最短路的精髓：**在图上不断用三角形不等式修正上界，直到收敛**

---

<!-- _class: lead -->

# Thanks！

