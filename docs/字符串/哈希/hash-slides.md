---
marp: true
theme: default
size: 16:9
paginate: true
footer: "算法竞赛课件 · 数据结构 / 字符串 / 图论"
---

<!-- _class: lead -->

# 哈希（Hash）
## 哈希表 · 字符串哈希 · 树哈希 · 可重集哈希

<!-- OI Wiki 课件 · `ds/hash` + `graph/tree-hash` + `misc/hash` -->

---

## 本节概览

| 章节 | 内容 | 难度 |
|:----:|------|:----:|
| **一** | 哈希表 — 拉链法 & 开放寻址法 | 提高 |
| **二** | 字符串哈希 — 多项式哈希 & 防卡技巧 | 提高 |
| **三** | 树哈希 — 树同构 & AHU 算法 | 省选 |
| **四** | 可重集哈希 — 多重集哈希 & 组合应用 | 提高 |

<!-- > 四个主题统一在"哈希"思想下：**将复杂对象映射为整数，以 O(1) 比较代替逐项比较** -->

---

<!-- _class: lead -->

## 一、哈希表（Hash Table）

---

## 引入：为什么需要哈希表？

**问题**：实现一个集合，支持插入和查找，数据范围 $10^9$。

| 方案 | 插入 | 查找 | 问题 |
|------|:---:|:---:|------|
| 数组直接寻址 | $O(1)$ | $O(1)$ | 需要 $10^9$ 空间，不可能 |
| 平衡树 `std::map` | $O(\log n)$ | $O(\log n)$ | 常数较大 |
| **哈希表** | 期望 $O(1)$ | 期望 $O(1)$ | 需要处理冲突 |
| `std::unordered_map` | 期望 $O(1)$ | 期望 $O(1)$ | STL 会处理冲突 |

**核心思想**：设计哈希函数 $h(x)$，将大范围键值映射到小范围索引，用空间换时间。

> 哈希表 = 一种"下标可以是任意类型"的高级数组

---

## 哈希函数设计

### 整数键 — 除留余数法

$$h(x) = x \bmod M$$

- $M$ 一般选取**质数**，且离 2 的幂次远一些
- 数据范围 $10^5$ 时常取 $M = 100003$（大于 $10^5$ 的第一个质数）
- 负数取模：`(x % M + M) % M`

---

## 冲突解决 1：拉链法（开散列）

**原理**：每个哈希槽维护一个链表，冲突的元素挂在链表上。

```
索引:  0     1     2     3     4    ...
       ↓     ↓     ↓     ↓     ↓
      [15]  [  ]  [10]  [  ]  [18]
       ↓           ↓           ↓
      [22]        [  ]        [  ]
```

- 查找时先定位槽位，再遍历链表逐一比对
- 期望比较次数 $O(N/M)$，$N$ 为元素数，$M$ 为槽位数
- 竞赛中常用**前向星（静态链表）**实现，避免动态内存

---

## 拉链法：C++ 模板

```cpp
const int M = 100003;  // 大于数据范围的质数
int head[M], e[M], ne[M], idx;
void init() { memset(head, -1, sizeof head); }
int hash(int x) { return (x % M + M) % M; }
void insert(int x) {
    int k = hash(x);
    e[idx] = x; ne[idx] = head[k]; head[k] = idx++;  // 头插
}
bool find(int x) {
    int k = hash(x);
    for (int i = head[k]; i != -1; i = ne[i])
        if (e[i] == x) return true;
    return false;
}
```

> `head` 初始化为 `-1` 表示空链表；负数用 `(x % M + M) % M` 处理

---

## 冲突解决 2：开放寻址法（闭散列）

**原理**：所有元素存在表中。冲突时按探查序列向后找空位。

```cpp
const int N = 200003;  // 开 2~3 倍，取质数
const int null = 0x3f3f3f3f;  // 哨兵值
int h[N];
void init() { memset(h, 0x3f, sizeof h); }
int find(int x) {  // 返回 x 应在的位置
    int k = (x % N + N) % N;
    while (h[k] != null && h[k] != x) {
        k++;
        if (k == N) k = 0;  // 循环回到开头
    }
    return k;
}

// 插入：int k = find(x); h[k] = x;
// 查询：h[find(x)] != null
```

---

## 两种方法对比

| 特性 | 拉链法 | 开放寻址法 |
|------|:------:|:--------:|
| 数据结构 | 数组 + 链表 | 纯数组 |
| 数组大小 | $\approx N$ | $2 \sim 3 N$ |
| 删除操作 | 可真正删除 | 需伪删除（打标记） |
| 缓存友好度 | 差（链表不连续） | **好**（连续数组） |
| 负载因子 | 可 > 1 | 必须 < 1 |
| 实现难度 | 略复杂（链表） | 较简单 |

---

## unordered_map

不管是拉链法还是开放寻址法，其代码实现都较为繁琐，实际往往是用 `std::unordered_map` 来实现。  
其使用方式几乎和普通数组完全相同。

```cpp
unordered_map<unsigned long long, int> mp;
// 清空
mp.clear();
// 赋值
mp[1145141919810] = 36;
// 求值
cout << mp[1145141919810] << '\n';
// 查询
if(mp.count(1145141919810)) {
    // do something
}
```

---
由于 `unordered_map` 内部实现也为哈希，容易被卡，因此往往使用 xor shift 的方法对原数据先处理一遍。

```cpp
struct custom_hash{
    static size_t splitmix64(size_t x){
        x+=0x9e3779b97f4a7c15;
        x=(x^(x>>30))*0xbf58476d1ce4e5b9;
        x=(x^(x>>27))*0x94d049bb133111eb;
        return x^(x>>31);
    }
    size_t operator()(size_t x)const{
        static const size_t FIXED_RANDOM=
            std::chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(x+FIXED_RANDOM);
    }
};
unordered_map<unsigned long long,int,custom_hash>mp;
```
这样就可以使用自定义的哈希函数实现 `unordered_map` 了。

---

在使用 `unordered_map` 时如果出现 `ans+=mp[x]` 这种语句时，`mp[x]` 实际上不一定在哈希表中出现过。  
但是一旦调用 `mp[x]` 后 `x` 会被直接插入哈希表，插入了大量不必要的值，会大大增加常数，因此一般都会写
```cpp
if(mp.count(x)) ans += mp[x];
```

另外一提，如果需要写 `unordered_map<unsigned long long,bool>`，不如直接写 `unordered_set<unsigned long long>`。

---

<!-- _class: lead -->

## 二、字符串哈希（String Hash）

---

## 多项式哈希：核心思想

将字符串 $S$ 看作 $\text{base}$ 进制数：

$$\text{hash}(S) = \sum_{i=1}^{n} S[i] \cdot \text{base}^{\,n-i} \pmod{M}$$

- 类似于将字符串转为一个巨大的整数
- 常用 $\text{base}$：$131$、$13331$、$233$（质数）
- 常用模数 $M$：$2^{64}$（`unsigned long long` 自然溢出）、$10^9+7$、$10^9+9$

---


```cpp
typedef unsigned long long ull;
const ull base = 131;

ull h[MAXN], pw[MAXN];  // 前缀哈希 + base的幂

void build(const string& s) {
    pw[0] = 1;
    for (int i = 1; i <= s.size(); i++) {
        h[i] = h[i - 1] * base + s[i - 1];
        pw[i] = pw[i - 1] * base;
    }
}
```

---

## 子串哈希：$O(1)$ 查询

**核心公式**：

$$\text{hash}(S[l..r]) = h[r] - h[l-1] \cdot \text{base}^{\,r-l+1}$$

```cpp
ull getHash(int l, int r) {  // 1-indexed
    return h[r] - h[l - 1] * pw[r - l + 1];
}
```

**为什么对？** 把 `h[l-1]` 乘上 $\text{base}^{r-l+1}$ 对齐到高位，做差即得子串哈希。

> 这就是字符串哈希的核心应用：**$O(n)$ 预处理后，$O(1)$ 判断任意两个子串是否相等**

---

## 字符串哈希的应用场景

| 应用 | 说明 |
|------|------|
| **字符串匹配** | 替代 KMP，$O(n)$ 预处理 + $O(1)$ 比较 |
| **最长公共前缀 LCP** | 二分 + 哈希，$O(\log n)$ 查询 |
| **回文判断** | 正反哈希，$O(1)$ 判断子串是否回文 |
| **循环节检测** | 判断 $S[1..n-k] == S[k+1..n]$ |
| **去重** | 将每个串映射为哈希值，排序/哈希表去重 |
| **字典序比较** | 二分 LCP + 比较下一字符 |

**模板题**：洛谷 P3370（字符串哈希）、P10468（兔子与兔子）

---

## 哈希碰撞与防御

### 为什么会有碰撞？

模数 $10^9+7$ 下，仅需约 $10^5$ 个元素，碰撞概率 > 99%（生日悖论）。

### 常见卡哈希方法

| 目标 | 攻击方法 |
|------|---------|
| 自然溢出 ($2^{64}$) | Thue-Morse 序列，长度 2048 即可碰撞 |
| 单模哈希 | 生日攻击，构造大量同长度子串 |
| 双模哈希 | 中国剩余定理合并后再攻击 |

---

### 防御策略

1. **双哈希**：两组 $(base, mod)$，都相等才判定相同
2. **大质数模数**：$10^{18}+3$ 等，配合 `__int128`
3. **随机化**：`base` 和 `mod` 都随机生成——最安全

---

## 双哈希模板

```cpp
typedef unsigned long long ull;
const ull mod1 = 1000000007, mod2 = 998244353;
const ull base1 = 131,  base2 = 13331;  // 或随机生成

pair<ull, ull> hashStr(const string& s) {
    ull h1 = 0, h2 = 0;
    for (char c : s) {
        h1 = (h1 * base1 + c) % mod1;
        h2 = (h2 * base2 + c) % mod2;
    }
    return {h1, h2};
}
```

---


也可以开两个前缀哈希数组，子串哈希返回 `pair`：

```cpp
auto getHash(int l, int r) {
    ull v1 = (h1[r] - h1[l-1] * pw1[r-l+1] % mod1 + mod1) % mod1;
    ull v2 = (h2[r] - h2[l-1] * pw2[r-l+1] % mod2 + mod2) % mod2;
    return make_pair(v1, v2);
}
```

> 忠告：**双哈希一定要改模数，不要只改进制！**

---

## 字符串哈希例题

| 题号 | 名称 | 考点 |
|:----:|------|------|
| P3370 | 【模板】字符串哈希 | 字符串去重 |
| P10468 | 兔子与兔子 | 子串哈希模板 |
| P3501 | 反对称 Antisymmetry | 哈希 + 二分求回文 |
| P3538 | OKR-A Horrible Poem | 循环节 + 哈希 + 质因数分解 |
| CF126B | Password | 前缀=后缀=子串，二分哈希 |
| P6739 | Three Friends | 枚举删除位置 + 哈希判断 |

> 字符串哈希 + 二分是一种非常通用的组合，可以替代很多字符串算法

---

<!-- _class: lead -->

## 三、树哈希（Tree Hash）

---

## 树同构：是什么？

> 两棵树**同构**：重新对节点编号后，它们的结构完全一致。

**有根树同构**：存在双射 $f$ 使 $(u,v) \in E_1 \iff (f(u), f(v)) \in E_2$，且 $f(r_1)=r_2$

**无根树同构**：不指定根时的同构判断

```
  ①           A
 / \         / \
②  ③       B   C
同构 ✓     同构 ✓

  ①           A
 / \         / \
②  ③       B   C
   /             \
  ④               D
不同构 ✗
```

---

## 有根树哈希：多重集哈希法

对以 $x$ 为根的子树，定义哈希值：

$$h_x = f(\{\,h_v \mid v \in son(x)\,\})$$

其中 $f$ 是**多重集的哈希函数**。推荐实现：

$$f(S) = 1 + \sum_{x \in S} g(x) \pmod{2^{64}}$$

$g(x)$ 为 xor shift 映射：

```cpp
ull mask = rand();  // 随机掩码防卡
ull shift(ull x) {
    x ^= mask; x ^= x << 13;
    x ^= x >> 7; x ^= x << 17;
    return x ^ mask;
}
```

---

## 有根树哈希：DFS 实现

```cpp
ull dfs(int u, int fa) {
    ull h = 1;  // 初始值 = 常数 c
    for (int v : g[u]) {
        if (v == fa) continue;
        h += shift(dfs(v, u));  // 累加儿子的哈希
    }
    return h;
}
```

**关键设计**：
- 用 `shift()` 打散子树的哈希，避免碰撞
- 使用加法（可交换）保证子树**顺序无关**
- `mask` 随机生成，防止被构造数据卡掉

---

## 无根树同构 → 重心转化

树哈希是对**有根树**的，无根树需要先确定根。核心技巧：**用重心做根**。

1. 求两棵树的**所有重心**（最多各 2 个）
2. **重心数量不同** → 一定不同构
3. **各 1 个重心** $c_1, c_2$：无根树同构 $\iff$ 以 $c_1, c_2$ 为根的有根树同构
4. **各 2 个重心** $(c_1,c_1'), (c_2,c_2')$：需检查 $T_1(c_1) \cong T_2(c_2)$ **或** $T_1(c_1') \cong T_2(c_2)$

> 一棵树的重心最多 2 个，只需比较至多 2 次

---

## 方法 2：换根 DP（适用于需要每个点为根的情况）

```cpp
void dfs1(int u, int fa) {
    h[u] = 1;
    for (int v : g[u]) if (v != fa) {
        dfs1(v, u);
        h[u] += shift(h[v]);
    }
}
// 第二次 DFS：换根，推导以每个点为根的哈希
void dfs2(int u, int fa) {
    rootHash[u] = h[u];  // 当前 h[u] 就是以 u 为根的哈希
    for (int v : g[u]) if (v != fa) {
        ull hu = h[u], hv = h[v];
        // 将 u 变成 v 的儿子
        h[u] -= shift(h[v]);
        h[v] += shift(h[u]);
        dfs2(v, u);
        h[u] = hu; h[v] = hv;
    }
}
```

> 换根 DP 可求出**每个点作为根**的哈希值，适用于需要对所有根去重的场景

---

## AHU 算法：最小表示法

**确定性算法**，无哈希冲突，判断有根树同构。

为每棵子树生成括号序列（最小表示），排序后拼接：

```cpp
string dfs(int u, int fa) {
    string s = "0";  // 进入的左括号
    vector children;
    for (int v : g[u]) if (v != fa)
        children.push_back(dfs(v, u));
    sort(children.begin(), children.end());  // 关键：排序保证唯一
    for (auto& c : children) s += c;
    s += "1";  // 离开的右括号
    return s;
}
```

> 两棵有根树同构 $\iff$ 根的最小表示 **完全相同**

---

## 树哈希 vs AHU 算法

| 特性 | 树哈希 | AHU 算法 |
|------|:-----:|:------:|
| 正确性 | 概率正确（有小概率冲突） | **严格正确** |
| 时间复杂度 | $O(n)$ | $O(n \log n)$（排序） |
| 代码量 | 短 | 中等 |
| 换根 DP | 易实现 | 较难实现 |
| 防卡性 | 需设计好哈希函数 | 天然防卡 |

**实战策略**：
- 先用**树哈希**，快速且大概率正确
- 如果不放心或被卡，改用 **AHU** 作为保底验证

---

## 树哈希例题

| 题号 | 名称 | 考点 |
|:----:|------|------|
| P5043 | 【模板】树同构 | 无根树同构判断 |
| UOJ #763 | 树哈希 | 不同构子树计数 |
| P4323 | [BJOI2015] 树的同构 | 多棵无根树分组 |

**P5043 思路**：
1. 对每棵树找重心
2. 以重心为根求树哈希（两个重心时取 min/max）
3. 对所有树的哈希值排序/哈希表分组
4. 输出每组第一个出现的位置

---

<!-- _class: lead -->

## 四、可重集哈希（Multiset Hash）

---

## 什么是可重集哈希？

> **问题**：如何快速判断两个**多重集**（元素可重复，顺序无关）是否相等？

例如：
- $A = \{1, 2, 2, 3\}$，$B = \{2, 3, 1, 2\}$ → 相等
- $A = \{1, 2, 3\}$，$B = \{1, 2, 2\}$ → 不相等

**直接比较**：排序后 $O(n \log n)$，或哈希表统计 $O(n)$，但多次比较时仍不够快。

**哈希法**：将整个多重集映射为一个数，实现 $O(1)$ 相等判断。

---

## 常见实现方式

### 1. 排序 + 进制哈希（顺序相关 → 需要排序）

将多重集排序后看成序列，再用字符串哈希。  
**缺点**：每次修改都需要重新排序，动态维护困难。

### 2. 累加哈希（无序）

$$h(S) = \sum_{x \in S} \text{hash}(x) \pmod M$$

- 顺序无关，插入/删除 $O(1)$ 更新
- **问题**：碰撞严重，例如 $\{1,4\}$ 和 $\{2,3\}$ 可能哈希相同

---

## 更健壮的方案：随机化

利用**组合哈希**：

$$h(S) = \sum_{x \in S} \text{shift}(\text{hash}(x))$$

其中 `shift` 是随机映射（如 xor shift），打散元素间的关联。

```cpp
ull getHash(const vector& S) {
    ull res = 0;
    for (int x : S) {
        res += shift(hashInt(x));  // hashInt 可自定义
    }
    return res;
}
```

插入/删除时只需加减对应的 `shift(hashInt(x))`，$O(1)$ 维护。

<!-- > 原理：随机化后的值在模 $2^{64}$ 下近似独立，碰撞概率极低。 -->

---

## 动态维护可重集

假设有一个动态集合，支持插入、删除、询问当前多重集的哈希值。

```cpp
unordered_map<ull, ull> cnt;   // 记录每个哈希值的出现次数
ull curHash = 0;
void insert(int x) {
    ull v = shift(hashInt(x));
    cnt[v]++;
    if (cnt[v] == 1) curHash += v;   // 第一次出现则加入
}
void erase(int x) {
    ull v = shift(hashInt(x));
    cnt[v]--;
    if (cnt[v] == 0) curHash -= v;   // 完全消失则移除
}
ull getHash() { return curHash; }
```

适用场景：滑动窗口、集合合并、回文重排判断等。

---

## 应用：判断两个多重集是否相同

给定多个多重集，需要分组（相同集合为一组）。

**做法**：对每个集合，将其元素哈希值累加（或异或）得到一个总哈希值，用哈希表统计。

```cpp
unordered_map<ull, vector> groups;
for (int i = 0; i < m; i++) {
    ull h = 0;
    for (int x : arr[i]) h += shift(hashInt(x));
    groups[h].push_back(i);
}
```

> 与字符串哈希类似，**双哈希**可进一步降低碰撞风险。

---

## 另一种随机化：预分配随机值法

除了动态计算 `shift(hash(x))`，另一种更直接、更常用的做法是：为每个可能出现的元素值预先分配一个固定的 64 位随机数，然后可重集的哈希值就是这些随机数的某种可交换组合（通常用异或或累加）。

**核心思想**

- 对于每个不同的元素值 `x`，用一个全局的 `unordered_map<ull, ull>` 或数组（若值域可离散化）保存其对应的随机数 `rnd[x]`。
- 插入 `x` 时，将 `rnd[x]` 累加（或异或）到当前哈希值中；删除时减去（或再次异或）。

---

## 生成随机数：使用 `mt19937_64`

`mt19937_64` 是 C++11 提供的 64 位梅森旋转随机数生成器，质量高且周期长，非常适合竞赛使用。

```cpp
#include 
using ull = unsigned long long;

std::mt19937_64 rng(random_device{}());

ull getRandom() {
    return rng();  // 生成一个 64 位随机数
}
```

---

## 映射元素到随机值

如果元素值域较小（如 $10^6$），可直接开数组：

```cpp
const int MAXV = 1000000;
ull rnd[MAXV + 1];
bool vis[MAXV + 1];

void initRandom() {
    for (int i = 1; i <= MAXV; i++) {
        rnd[i] = rng();
    }
}
```

---

如果值域很大或不确定（如字符串、大整数），用 `unordered_map` 延迟生成：

```cpp
unordered_map<ull, ull> mp;  // 元素值 → 随机值

ull getRnd(ull x) {
    if (mp.count(x)) return mp[x];
    return mp[x] = rng();  // 首次出现时分配随机数
}
```

---

## 与树哈希的关系

树哈希中的多重集哈希正是本节内容的直接应用：

$$h_x = 1 + \sum_{v \in son(x)} \text{shift}(h_v)$$

- 每个子树哈希值作为多重集元素，累加得到父节点哈希
- 顺序无关，符合子树无序性要求

所以，**可重集哈希是树哈希的基础组件**。

---

## 注意事项

| 问题 | 解决方案 |
|------|---------|
| 碰撞 | 使用双哈希（两个模数/两种随机映射） |
| 0 元素 | 乘法哈希时避免使用 0，或采用 `+1` 偏移 |
| 负数 | 统一取模或转为无符号整数 |
| 动态更新 | 用 `unordered_map` 记录每个哈希值出现次数 |
| 随机化 | 程序启动时生成随机种子，防止被卡 |

---

<!-- _class: lead -->

## 五、总结

---

## 四种哈希的对比

| 维度 | 哈希表 | 字符串哈希 | 树哈希 | 可重集哈希 |
|------|:-----:|:--------:|:-----:|:--------:|
| 哈希对象 | 任意键值 | 字符串 | 树结构 | 多重集 |
| 核心思想 | 除留余数法 | 进制多项式 | 多重集哈希 | 累加/异或 |
| 冲突处理 | 拉链、开放 |  大模数 | xor shift 打散 | 随机化 |
| 典型复杂度 | 期望 $O(1)$ | $O(1)$ 子串比较 | $O(n)$ 整树比较 | $O(1)$ 动态维护 |
| 主要应用 | 快速查找 | 字符串匹配 | 树同构判断 | 集合相等 |
| 防卡策略 | 质数模数 | 双哈希 + 随机化 | 随机掩码 + shift | 随机映射 + 双哈希 |

---

## 核心要点回顾

1. **哈希表**：`(x % M + M) % M` 处理负数，开放寻址法开 2~3 倍空间
2. **字符串哈希**：$h[r] - h[l-1] \cdot \text{base}^{r-l+1}$ 实现 $O(1)$ 子串比较
3. **双哈希保平安**：两个模数，两个基数，都相等才算相等
4. **树哈希**：$h_x = 1 + \sum \text{shift}(h_{son})$，用重心将无根树转有根树
5. **AHU 算法**：子树的括号序列排序拼接，确定性判断同构
6. **可重集哈希**：$h(S) = \sum \text{shift}(\text{hash}(x))$，顺序无关，支持动态更新

> 哈希的本质：用**极低碰撞概率**换取**极高效率**

<!-- --- -->

<!-- _class: lead -->

<!-- ## 参考与延伸

📖 **OI Wiki 原始页面**：
- [哈希表](https://oi-wiki.org/ds/hash/)
- [树哈希](https://oi-wiki.org/graph/tree-hash/)
- [AHU 算法](https://oi-wiki.org/graph/tree-ahu/)

📖 **防卡哈希参考**：
- [一种好写且卡不掉的树哈希](https://peehs-moorhsum.blog.uoj.ac/)
- 洛谷 Hash Killer 系列（P12197 ~ P12201）

📝 **刷题推荐**：P3370 → P10468 → P3501 → P5043 → P4323 → 可重集相关题目 -->

---

<!-- _class: lead -->

# Thanks！
