---
marp: true
theme: default
size: 16:9
paginate: true
header: "Trie（字典树）— OI Wiki"
footer: "算法竞赛课件"
---

<!-- _paginate: false -->

# Trie（字典树 / 前缀树）

---

<!-- _paginate: true -->

## 本节概览

1. **引入** — 为什么需要 Trie？
2. **基本概念** — Trie 的定义与结构
3. **核心操作** — 插入、查找、删除
4. **复杂度分析** — 时间与空间
5. **进阶变体** — 01-Trie、可持久化 Trie
6. **经典例题** — 从模板到省选
7. **注意事项** — 常见易错点

---

<!-- _class: lead -->

## 一、引入

为什么需要字典树？

---

## 一个问题

> 给定 $n$ 个单词组成的词典。接下来有 $m$ 次询问，每次询问一个单词是否在词典中。

| 方法 | 查询复杂度 | 问题 |
|------|-----------|------|
| 暴力匹配 | $O(n \times S)$ | 太慢 |
| `std::map` 哈希 | $O(S \log n)$ | 无法处理前缀 |
| **Trie** | $O(S)$ | ✅ 又快又好 |

---

Trie 的三个核心优势：
- **查询快**：$O(|S|)$，与词典大小无关
- **支持前缀查询**：天然支持"有多少单词以某前缀开头"
- **空间可接受**：利用公共前缀压缩存储

---

<!-- _class: lead -->

## 二、基本概念

---

## 什么是 Trie？

**Trie**（字典树，也称前缀树 / Prefix Tree）是一种 **用边代表字符** 的树形结构。

> 从根节点到某一节点的路径，就代表一个字符串。

关键特性：
- 根节点**不包含字符**，是一个空节点
- 每条**边**对应一个字符
- 一个节点的所有子节点对应的字符**互不相同**
- 从根到叶子节点的路径对应一个完整的单词

---

## 结构图示

以单词集合 `{"cat", "car", "dog", "do"}` 为例：

```
         (root)
        /   |   \
       c    d    ...
      /     |
     a      o
    / \    / \
   t*  r* g*  (do*)
```

- 标 `*` 的节点表示单词结尾
- `"do"` 的路径是 `root → d → o`（注意 `o` 同时是 `dog` 的中间节点）
- 公共前缀 `ca` 只用一条路径存，节省空间

---

## 节点结构

每个 Trie 节点需要存储：

```cpp
struct TrieNode {
    int next[26];   // 子节点指针（假设只有小写字母）
    bool exist;     // 是否有单词在此节点结束
};
```

| 字段 | 含义 | 说明 |
|------|------|------|
| `next[c]` | 字符 $c$ 对应的子节点编号 | $0$ 表示不存在 |
| `exist` | 标记是否为某单词结尾 | 区分前缀和完整单词 |

> 字符集大小 $|\Sigma|$ 决定 `next` 数组的大小，小写字母为 26，数字为 10，01-Trie 为 2。

---

<!-- _class: lead -->

## 三、核心操作

---

## 插入操作 — 算法流程

将字符串 `s` 插入 Trie：

```
1. 从根节点出发，p = 0
2. 遍历 s 的每个字符 c：
   a. 如果 p 的 next[c] 为空 → 创建新节点
   b. 令 p = next[c]，继续向下
3. 遍历结束，在节点 p 标记 exist[p] = true
```

**关键**：有路走路，没路建路。

> 时间复杂度：$O(L)$，$L$ 为字符串长度。

---

## 插入操作 — 代码

```cpp
void insert(const string& s) {
    int p = 0;
    for (char ch : s) {
        int c = ch - 'a';            // 字符 → 下标
        if (!nxt[p][c])              // 没有路？
            nxt[p][c] = ++tot;       // 新建节点
        p = nxt[p][c];               // 走下去
    }
    exist[p] = true;                 // 标记单词结尾
}
```

**核心就是两句话**：

> 没有就建，建完就往下走。

---

## 插入示例

插入 `"cat"` 和 `"car"` 后：

```
         (root)
            |
            c (tot=1)
            |
            a (tot=2)
           / \
    (tot=3) t* r* (tot=4)
```

---

插入 `"cat"` 时的操作：
- `c` → 没有，创建节点 1，`p=1`
- `a` → 没有，创建节点 2，`p=2`
- `t` → 没有，创建节点 3，`p=3`
- 结束，`exist[3] = true`

插入 `"car"` 时，`c` 和 `a` 复用已有路径，只需新建 `r` 节点。

---

## 查找操作 — 算法流程

查找字符串 `s` 是否在 Trie 中：

```
1. 从根节点出发，p = 0
2. 遍历 s 的每个字符 c：
   a. 如果 p 的 next[c] 为空 → 不存在，返回 false
   b. 令 p = next[c]
3. 遍历结束 → 返回 exist[p]
```

> **注意**：`exist[p]` 检查不能忘！如果忘了检查，`"ca"` 也会被认为是存在的（它只是 `"cat"` 的前缀）。

> 时间复杂度：$O(L)$。

---

## 查找操作 — 代码

```cpp
bool find(const string& s) {
    int p = 0;
    for (char ch : s) {
        int c = ch - 'a';
        if (!nxt[p][c])          // 中途没路了
            return false;        // 肯定不存在
        p = nxt[p][c];
    }
    return exist[p];             // 走到终点 ≠ 单词存在
}
```

---

## 删除操作 — 计数法

Trie 的删除通常不真正释放节点（太复杂），而是用**计数法**：

```cpp
int cnt[MAXN];   // cnt[p] = 以节点 p 结尾的单词数量

void remove(const string& s) {
    int p = 0;
    for (char ch : s) {
        int c = ch - 'a';
        if (!nxt[p][c]) return;  // 不存在，直接返回
        p = nxt[p][c];
    }
    if (cnt[p] > 0) cnt[p]--;    // 减少计数
}

bool find(const string& s) {
    // ... 走到终点后
    return cnt[p] > 0;           // 用 cnt 替代 exist
}
```

---

## 完整模板代码（基础版）

```cpp
const int MAXN = 100000;  // 总字符数

struct Trie {
    int nxt[MAXN][26], tot;
    bool exist[MAXN];

    Trie() : tot(0) {
        memset(nxt, 0, sizeof(nxt));
        memset(exist, 0, sizeof(exist));
    }

    void insert(const string& s) {
        int p = 0;
        for (char ch : s) {
            int c = ch - 'a';
            if (!nxt[p][c]) nxt[p][c] = ++tot;
            p = nxt[p][c];
        }
        exist[p] = true;
    }

    bool find(const string& s) {
        int p = 0;
        for (char ch : s) {
            int c = ch - 'a';
            if (!nxt[p][c]) return false;
            p = nxt[p][c];
        }
        return exist[p];
    }
};
```

---

## 复杂度分析

### 时间复杂度

| 操作 | 复杂度 | 说明 |
|------|--------|------|
| 插入 | $O(L)$ | $L$ 为字符串长度 |
| 查找 | $O(L)$ | 最坏走完整个字符串 |
| 删除 | $O(L)$ | 计数法同样沿路径走一遍 |

> 全部与词典大小 $n$ **无关**。

---

### 空间复杂度

$$O(\text{总字符数} \times |\Sigma|)$$

- 最坏情况（无公共前缀）：每个字符都新建节点
- 最好情况（全部共享前缀）：空间很小
- 实际比赛常用 $O(10^5 \times 26)$ 左右

---

<!-- _class: lead -->

## 四、进阶变体

---

## 01-Trie（二进制字典树）

**本质**：字符集 $\Sigma = \{0, 1\}$ 的 Trie。

**核心用途**：解决**异或极值**问题。

将数字按二进制位从高到低插入 Trie 中：

```cpp
// 插入数字 x（二进制表示）
void insert(int x) {
    int p = 0;
    for (int i = 30; i >= 0; i--) {
        int b = (x >> i) & 1;      // 取第 i 位
        if (!ch[p][b]) ch[p][b] = ++tot;
        p = ch[p][b];
    }
}
```

> 复杂度 $O(\log V)$，$V$ 为值域。通常从 **最高位** 开始插，方便贪心。

---

## 01-Trie：求最大异或值

**贪心策略**：对于当前数的第 $i$ 位，尽量走与它相反的位（`b ^ 1`），这样异或结果的这一位为 1。

```cpp
int query(int x) {   // 返回当前 Trie 中与 x 异或的最大值
    int p = 0, ans = 0;
    for (int i = 30; i >= 0; i--) {
        int b = (x >> i) & 1;
        if (ch[p][b ^ 1]) {       // 存在相反位，贪心选它
            ans |= (1 << i);
            p = ch[p][b ^ 1];
        } else {
            p = ch[p][b];          // 否则只能走相同位
        }
    }
    return ans;
}
```

> 求"最大异或对"时，边插入边查询即可：`ans = max(ans, query(x)); insert(x);`

---

## 01-Trie 进阶：全局 +1

**神奇操作**：在 01-Trie 中支持所有数字 **全局 +1**。

将 01-Trie **从低位到高位** 建树，全局 +1 相当于：

```
+1 操作：最低位的 0→1，后面连续的 1→0
Trie 上：交换左右儿子，递归进入原左儿子
```

```cpp
void add_one(int p) {
    swap(ch[p][0], ch[p][1]);   // 交换左右儿子
    if (ch[p][0]) add_one(ch[p][0]);  // 递归进原左儿子（即现右儿子）处理进位
}
```

> 用于维护一堆数的异或和，同时支持插入/删除和全局 +1（如 P6623）。
---

<!-- _class: lead -->

## 五、应用场景与例题

---

## 应用场景总结

| 应用 | 说明 | 典型题目 |
|------|------|---------|
| 字符串检索 | 判断单词是否在词典中 | P2580 点名 |
| 前缀统计 | 统计以某前缀开头的单词数 | — |
| 最大异或对 | 01-Trie 贪心 | AcWing 143 |
| 最大异或和（区间） | 可持久化 01-Trie | P4735 |
| 异或和 + 全局加一 | 低位建 01-Trie | P6623 |
| 多模式串匹配 | AC 自动机（Trie + fail 边） | P3808 |
| 01-Trie 合并 | 类似线段树合并 | P6018 |

---

## 例题 1：于是他错误的点名开始了

**题目**：[P2580](https://www.luogu.com.cn/problem/P2580)（洛谷）

> 给定 $n$ 个名字，$m$ 次点名。每次点名输出：
> - `OK`：名字存在且第一次被点
> - `REPEAT`：名字存在但已被点过
> - `WRONG`：名字不存在

---

**做法**：裸 Trie + `cnt` 数组记录被点次数。

```cpp
void query(const string& s) {
    int p = 0;
    for (char ch : s) {
        int c = ch - 'a';
        if (!nxt[p][c]) { cout << "WRONG\n"; return; }
        p = nxt[p][c];
    }
    if (!exist[p]) { cout << "WRONG\n"; return; }
    if (cnt[p]++) cout << "REPEAT\n";
    else cout << "OK\n";
}
```

---

## 例题 2：最大异或对

**题目**：[AcWing 143](https://www.acwing.com/problem/content/145/)

> 给定 $n$ 个数 $a_1, a_2, \ldots, a_n$，选出两个数使它们的异或值最大。$n \le 10^5$。

**做法**：01-Trie。

```
1. 初始化空 Trie
2. 遍历每个数 x：
   a. 在 Trie 中查与 x 异或的最大值，更新答案
   b. 把 x 插入 Trie
3. 输出答案
```

> 复杂度 $O(n \log V)$。关键理解：**最高位不同** 能使结果最大，所以要逐位贪心。

---

<!-- _class: lead -->

## 六、注意事项与总结

---

## 常见易错点

| 易错点 | 说明 |
|--------|------|
| **忘记检查 exist** | 单词前缀也可能走到节点，但 `exist` 为 false |
| **数组开太小** | `MAXN` = 总字符数 = 单词数 × 平均长度，不是单词数！ |
| **字符集越界** | 字符 `- 'a'` 前要确保是字母，或大小写统一处理 |
| **多测不清空** | 每次 `memset` 整个 `nxt` 数组可能 TLE，用 `tot = 0` + 按需清空 |
| **01-Trie 位数不够** | $10^9 < 2^{30}$，至少开 30 或 31 位 |

> 💡 多测优化：不要 `memset` 整个 1e5 的数组，只需把用过的节点置零，或重新 `tot = 0` 时初始化 `nxt[tot]`。

---

## 总结

Trie 是字符串和进制问题的**核心数据结构**：

```
基础 Trie
  ├── 字符串检索（P2580）
  └── 前缀统计
       │
       ▼
01-Trie（字符集 {0, 1}）
  ├── 异或极值（AcWing 143）
  ├── 全局 +1 + 异或和（P6623）
  ├── 01-Trie 合并
       │
       ▼
AC 自动机（Trie + KMP）
  └── 多模式串匹配（P3808）
```

---

# 谢谢！

## Q & A

