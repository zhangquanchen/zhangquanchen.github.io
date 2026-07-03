---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

# 👋 About Me
I am currently a PhD student at [Tsinghua University](https://www.tsinghua.edu.cn/), devoted to advancing AGI by enhancing the understanding capabilities of multimodal large language models. My main focus is on reinforced reasoning, spatial intelligence, etc.. Prior to this, I conducted research at [Massachusetts Institute of Technology (MIT)](https://www.mit.edu/) and earned my B.S. in Electronic Engineering from [Sun Yat-sen University](https://www.sysu.edu.cn/).

I have been working on large language model development since 2022. I previously served as CTO and Co-founder of [Beijing OneXOne Tech Co., Ltd.](https://shizhe.chat/), a Series A-funded startup, where I led the development of Hibug (an early SOTA coding LLM) and Shizhe (an education-focused MLLM). Related products were later acquired by Xueda Education (a publicly listed company).

Since 2024, I have interned at [Microsoft Research Asia (MSRA)](https://www.microsoft.com/en-us/research/lab/microsoft-research-asia/), [ByteDance](https://www.bytedance.com/zh/) (筋斗云人才计划), [Tencent Hunyuan](https://hy.tencent.com/) (青云人才计划), and [Meituan LongCat](https://longcat.chat/) (北斗人才计划), mainly working on post-training for large language models, especially reinforcement learning.

I have authored 30+ papers, including ~20 publications in CCF-A conferences/journals and 10+ first-author papers.

I am currently seeking suitable collaboration or job opportunities. Feel free to reach out! ([czq23@mails.tsinghua.edu.cn](mailto:czq23@mails.tsinghua.edu.cn)).


<span class='anchor' id='news'></span>

# 🔥 News
- *2026.06*: &nbsp;🎉 One paper (<a href="#paper-spamem">SpaMEM</a>) has been accepted by **ECCV 2026**.
- *2026.05*: &nbsp;🎉 Release technical report <a href="/#report-llava-ov2"><em>LLaVA-OneVision-2.0</em></a>.
- *2026.05*: &nbsp;🎉 Four papers (<a href="/#paper-omnivideo-r1">OmniVideo-R1</a>, <a href="/#paper-gtasr">GTASR</a>, <a href="/#paper-reasoning-vla">Reasoning-VLA</a>, <a href="/#paper-l2-vmas">L²-VMAS</a>) have been accepted by **ICML 2026**.
- *2026.04*: &nbsp;🎉 Release technical report <a href="/#report-script-a-video"><em>Script-a-Video</em></a> in Tencent Hunyuan Team.
<!-- - *2026.04*: &nbsp;🎉 Release comprehensive survey <a href="/#latent-space"><em>The Latent Space</em></a>. -->
- *2026.02*: &nbsp;🎉 Three papers (<a href="/#paper-3dthinker">3DThinker</a>, <a href="/#paper-mact">MACT</a> (<span style="color:red">Highlight</span>), <a href="/#paper-vismem">VisMem</a>) have been accepted by **CVPR 2026**.
- *2026.01*: &nbsp;🎉 One paper (<a href="/#paper-vif">ViF</a>) has been accepted by **ICLR 2026**.
- *2025.11*: &nbsp;🎉 Two papers (<a href="/#paper-sifthinker">SIFThinker</a>, <a href="/#paper-childbench">ChildBench</a> (<span style="color:red">Oral</span>)) have been accepted by **AAAI 2026**.
- *2025.06*: &nbsp;🎉 One paper (<a href="/#paper-visrl">VisRL</a>) has been accepted by **ICCV 2025**.
- *2025.04*: &nbsp;🎉 One paper has been accepted by CVPRW 2025 (<span style="color:red">Highlight</span>).
- *2025.03*: &nbsp;🎉 One paper (<a href="/#paper-dv-matcher">DV-Matcher</a>) has been accepted by **CVPR 2025**.
- *2024.04*: &nbsp;🎉 One paper (<a href="/#paper-three-phases-lora">Three-Phases-LoRA</a>) has been accepted by ICANN 2024. 

<span class='anchor' id='education'></span>

# 📖 Education

<div class="education-item">
  <div class="education-logo"><img src="images/tsinghua.png" alt="Tsinghua University"></div>
  <div class="education-text"><strong>Sep. 2026 – Dec. 2027:</strong> <strong>Ph.D.</strong>, Data Science and Information Technology, <a href="https://www.tsinghua.edu.cn/"><strong style="color:#A31515">Tsinghua University (THU)</strong></a>, Beijing, China.</div>
</div>
<div class="education-item">
  <div class="education-logo"><img src="images/mit.png" alt="MIT"></div>
  <div class="education-text"><strong>Dec. 2024 – Jul. 2025:</strong> Research Intern, Multisensory Intelligence Group, <a href="https://www.mit.edu/"><strong style="color:#A31515">Massachusetts Institute of Technology (MIT)</strong></a>, Remote.</div>
</div>
<div class="education-item">
  <div class="education-logo"><img src="images/tsinghua.png" alt="Tsinghua University"></div>
  <div class="education-text"><strong>Sep. 2023 – Jun. 2026:</strong> M.Sc. (change to Ph.D.), Data Science and Information Technology, <a href="https://www.tsinghua.edu.cn/"><strong style="color:#A31515">Tsinghua University (THU)</strong></a>, Beijing, China.</div>
</div>
<div class="education-item">
  <div class="education-logo"><img src="images/sysu.png" alt="Sun Yat-sen University"></div>
  <div class="education-text"><strong>Sep. 2019 – Jun. 2023:</strong> B.Sc., Electronic Information Science and Technology, <a href="https://www.sysu.edu.cn/">Sun Yat-sen University</a>, Guangzhou, China. (<strong>Rank 2/123</strong>)</div>
</div>

<span class='anchor' id='technical-report'></span>

# 📑 Technical Report

<span class='anchor' id='report-script-a-video'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">Report</div>
      <img src='images/mtss.png' alt="Script-a-Video" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Script-a-Video: Deep Structured Audio-visual Captions via Factorized Streams and Relational Grounding</div>
    <div class='paper-authors'>Tencent Hunyuan Team · <strong>Zhangquan Chen</strong> (Core Contributor)</div>
    <div class='paper-venue'>Technical report, 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2604.11244"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://mp.weixin.qq.com/s/A6N2-cAo-ddCAGNKo7L7OA"><i class="fab fa-weixin"></i> Media</a>
    </div>
  </div>
</div>

<span class='anchor' id='report-llava-ov2'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">Report</div>
      <img src='images/ov2.png' alt="LLaVA-OneVision-2" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>LLaVA-OneVision-2: Towards Next-Generation Perceptual Intelligence</div>
    <div class='paper-authors'>LLaVA-OneVision-2 Team · <strong>Zhangquan Chen</strong></div>
    <div class='paper-venue'>Technical report, 2026</div>
    <div class='paper-links'>
      <a href="https://evolvinglmms-lab.github.io/LLaVA-OneVision-2/"><i class="fas fa-home"></i> Project page</a>
      <span class="link-sep">|</span>
      <a href="https://arxiv.org/pdf/2605.25979"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/EvolvingLMMs-Lab/LLaVA-OneVision-2"><i class="fab fa-github"></i> Code</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/lmms-lab-encoder/LLaVA-OneVision-2-8B-Instruct"><i class="fas fa-cube"></i> Model</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/datasets/mvp-lab/LLaVA-OneVision-2-Data"><i class="fas fa-database"></i> Dataset</a>
      <span class="link-sep">|</span>
      <a href="https://mp.weixin.qq.com/s/dechFptcXCvF30mfmC3dWA"><i class="fab fa-weixin"></i> Media</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/spaces/FeilongTang/OneVision-Encoder-Codec-View"><i class="fas fa-rocket"></i> Playground</a>
    </div>
  </div>
</div>

<span class='anchor' id='publications'></span>

# 📝 Selected Publications 
<!-- <p style="font-size: 0.9em; color: #666; margin-bottom: 1em;">† Equal contribution</p> -->
<span class='anchor' id='paper-visrl'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">ICCV</div>
      <img src='images/visrl.png' alt="VisRL" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>VisRL: Intention-Driven Visual Perception via Reinforced Reasoning</div>
    <div class='paper-authors'><strong>Zhangquan Chen</strong>, Xufang Luo, Dongsheng Li</div>
    <div class='paper-venue'>International Conference on Computer Vision (<strong>ICCV</strong>) & CVPRW <strong>Highlight</strong>, 2025</div>
    <div class='paper-links'>
      <a href="https://tsinghua88.github.io/visrl.github.io/"><i class="fas fa-home"></i> Project page</a>
      <span class="link-sep">|</span>
      <a href="https://openaccess.thecvf.com/content/ICCV2025/papers/Chen_VisRL_Intention-Driven_Visual_Perception_via_Reinforced_Reasoning_ICCV_2025_paper.pdf"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/zhangquanchen/VisRL"><i class="fab fa-github"></i> Code</a>
    </div>
  </div>
</div>

<span class='anchor' id='paper-dv-matcher'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">CVPR</div>
      <img src='images/dv-matcher.png' alt="DV-Matcher" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>DV-Matcher: Deformation-based Non-Rigid Point Cloud Matching Guided by Pre-trained Visual Features</div>
    <div class='paper-authors'><strong>Zhangquan Chen</strong>, Puhua Jiang, Ruqi Huang</div>
    <div class='paper-venue'>Computer Vision and Pattern Recognition (<strong>CVPR</strong>), 2025</div>
    <div class='paper-links'>
      <a href="https://openaccess.thecvf.com/content/CVPR2025/papers/Chen_DV-Matcher_Deformation-based_Non-rigid_Point_Cloud_Matching_Guided_by_Pre-trained_Visual_CVPR_2025_paper.pdf"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/rqhuang88/DV-Matcher"><i class="fab fa-github"></i> Code</a>
      <span class="link-sep">|</span>
      <a href="https://drive.google.com/drive/folders/1CK9qihI2yyxkuXsxSHqzTRhLdTk8qghn"><i class="fas fa-database"></i> Dataset</a>
    </div>
  </div>
</div>

<span class='anchor' id='paper-sifthinker'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">AAAI</div>
      <img src='images/sifthinker.png' alt="SIFThinker" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>SIFThinker: Spatially-Aware Image Focus for Visual Reasoning</div>
    <div class='paper-authors'><strong>Zhangquan Chen</strong>, Ruihui Zhao, Chuwei Luo, Mingze Sun, Xinlei Yu, Yangyang Kang, Ruqi Huang</div>
    <div class='paper-venue'>AAAI Conference on Artificial Intelligence (<strong>AAAI</strong>), 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2508.06259"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/zhangquanchen/SIFThinker"><i class="fab fa-github"></i> Code</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/datasets/jankin123/SIF-50K"><i class="fas fa-database"></i> Dataset</a>
    </div>
  </div>
</div>

<span class='anchor' id='paper-3dthinker'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">CVPR</div>
      <img src='images/3dthinker.png' alt="3DThinker" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Think with 3D: Geometric Imagination Grounded Spatial Reasoning from Limited Views</div>
    <div class='paper-authors'><strong>Zhangquan Chen</strong>, Manyuan Zhang, Xinlei Yu, Xufang Luo, Mingze Sun, Zihao Pan, Yan Feng, Peng Pei, Xunliang Cai, Ruqi Huang</div>
    <div class='paper-venue'>Computer Vision and Pattern Recognition (<strong>CVPR</strong>), 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2510.18632"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/zhangquanchen/3DThinker"><i class="fab fa-github"></i> Code</a>
      <span class="link-sep">|</span>
      <a href="https://mp.weixin.qq.com/s/wMJ2KGBnEbDze0hoS4hCaQ"><i class="fab fa-weixin"></i> Media</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/datasets/jankin123/3DThinker-10K"><i class="fas fa-database"></i> Dataset</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/jankin123/3DThinker-Mindcube"><i class="fas fa-cube"></i> Model</a>
    </div>
  </div>
</div>

<span class='anchor' id='paper-omnivideo-r1'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">ICML</div>
      <img src='images/omnivideo-r1.png' alt="OmniVideo-R1" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>OmniVideo-R1: Reinforcing Audio-visual Reasoning with Query Intention and Modality Attention</div>
    <div class='paper-authors'><strong>Zhangquan Chen</strong>, Jiale Tao, Ruihuang Li, Yihao Hu, Ruitao Chen, Zhantao Yang, Xinlei Yu, Haodong Jing, Manyuan Zhang, Shuai Shao, Biao Wang, Qinglin Lu, Ruqi Huang</div>
    <div class='paper-venue'>International Conference on Machine Learning (<strong>ICML</strong>), 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2602.05847"><i class="fas fa-file-pdf"></i> Paper</a>
      <!-- <span class="link-sep">|</span>
      <a href="https://github.com/zhangquanchen/OmniVideo-R1"><i class="fab fa-github"></i> Code</a> -->
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/datasets/jankin123/OmniVideo-R1"><i class="fas fa-database"></i> Dataset</a>
    </div>
  </div>
</div>

<span class='anchor' id='paper-4dthinker'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/4dthinker.png' alt="4DThinker" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>4DThinker: Thinking with 4D Imagery for Dynamic Spatial Understanding</div>
    <div class='paper-authors'><strong>Zhangquan Chen</strong>, Manyuan Zhang, Xinlei Yu, Xiang An, Bo Li, Xin Xie, ZiDong Wang, Mingze Sun, Shuang Chen, Hongyu Li, Xiaobin Hu, Ruqi Huang</div>
    <div class='paper-venue'>arXiv 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2605.05997"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/zhangquanchen/4DThinker"><i class="fab fa-github"></i> Code</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/jankin123/4DThinker-3B"><i class="fas fa-cube"></i> Model</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/datasets/jankin123/4DThinker-Training-Data"><i class="fas fa-database"></i> Dataset</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/nfr.gif' alt="NFR" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>NFR: Neural Feature-Guided Non-Rigid Shape Registration</div>
    <div class='paper-authors'><strong>Zhangquan Chen</strong>, Puhua Jiang, Mingze Sun, Ruqi Huang</div>
    <div class='paper-venue'>arXiv 2025</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2505.22445"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/rqhuang88/NFR"><i class="fab fa-github"></i> Code</a>
    </div>
  </div>
</div>

<span class='anchor' id='paper-three-phases-lora'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">ICANN</div>
      <img src='images/threephase.png' alt="Three-Phases-LORA" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>A Three-Phases-LORA Finetuned Hybrid LLM Integrated with Strong Prior Module in the Education Context</div>
    <div class='paper-authors'><strong>Zhangquan Chen</strong>, Chunjiang Liu, Haobin Duan</div>
    <div class='paper-venue'>International Conference on Artificial Neural Networks, 2024</div>
    <div class='paper-links'>
      <a href="https://link.springer.com/chapter/10.1007/978-3-031-72344-5_16"><i class="fas fa-file-pdf"></i> Paper</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/meow-omni.png' alt="Meow-Omni 1" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Meow-Omni 1: A Multimodal Large Language Model for Feline Ethology</div>
    <div class='paper-authors'>Jucheng Hu†, <strong>Zhangquan Chen</strong>†, Yulin Chen, Chengjie Hong, Liang Zhou, Tairan Wang, Sifei Li, Giulio Zhu, Feng Zhou, Yiheng Zeng, Suorong Yang, Dongzhan Zhou</div>
    <div class='paper-venue'>(† equal contribution) arXiv 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2605.09152"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/smgjch/Meow-Omni-1"><i class="fab fa-github"></i> Code</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/smgjch/Meow-Omni-1"><i class="fas fa-cube"></i> Model</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/smgjch/Meow-Omni-1-Base"><i class="fas fa-cube"></i> Base Model</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/datasets/smgjch/meow-10k"><i class="fas fa-database"></i> Dataset</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/datasets/smgjch/MeowBench"><i class="fas fa-vial"></i> Benchmark</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/a-grae.png' alt="A-GRAE" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Unveiling Implicit Advantage Symmetry: Why GRPO Struggles with Exploration and Difficulty Adaptation</div>
    <div class='paper-authors'>Zhiqi Yu†, <strong>Zhangquan Chen</strong>†, Mengting Liu, Heye Zhang, Liangqiong Qu</div>
    <div class='paper-venue'>(† equal contribution) arXiv 2026</div>
    <div class='paper-links'>
      <a href="https://yu7-code.github.io/A-GRAE-web/"><i class="fas fa-home"></i> Project page</a>
      <span class="link-sep">|</span>
      <a href="https://arxiv.org/pdf/2602.05548"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/HKU-HealthAI/A-GRAE"><i class="fab fa-github"></i> Code</a>
    </div>
  </div>
</div>

<span class='anchor' id='latent-space'></span>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/latentsurvey.png' alt="The Latent Space survey" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>The Latent Space: Foundation, Evolution, Mechanism, Ability, and Outlook</div>
    <div class='paper-authors'>Xinlei Yu†, <strong>Zhangquan Chen</strong>†, Yongbo He†, Tianyu Fu†, Cheng Yang†, Chengming Xu†, Yue Ma†, Xiaobin Hu†, Zhe Cao, Jie Xu, Guibin Zhang, Jiale Tao, Jiayi Zhang, Siyuan Ma, Kaituo Feng, Haojie Huang, Youxing Li, Ronghao Chen, Huacan Wang, Chenglin Wu, Zikun Su, Xiaogang Xu, Kelu Yao, Kun Wang, Chen Gao, Yue Liao, Ruqi Huang, Tao Jin, Zhucun Xue, Cheng Tan, Jiangning Zhang, Wenqi Ren, Yanwei Fu, Yong Liu, Yu Wang, Xiangyu Yue, Yu-Gang Jiang, Shuicheng Yan</div>
    <div class='paper-venue'>(† equal contribution) arXiv 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2604.02029"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/YU-deep/Awesome-Latent-Space"><i class="fab fa-github"></i> Repository</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/papers/2604.02029"><i class="fas fa-newspaper"></i> Hugging Face</a>
      <span class="link-sep">|</span>
      <a href="https://mp.weixin.qq.com/s/6Fini_pAUyB7B5R6GIdfAQ"><i class="fab fa-weixin"></i> Media</a>
    </div>
  </div>
</div>

<span class='anchor' id='paper-childbench'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">AAAI</div>
      <img src='images/childbench.png' alt="ChildBench" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Easy for Children, Hard for AI: The Limits of Multimodal LLMs in Early Childhood Learning</div>
    <div class='paper-authors'>Jingping Liu, Xueyan Wu, Hanxuan Chen, Ziyan Liu, <strong>Zhangquan Chen</strong>, Ronghao Chen, Huacan Wang</div>
    <div class='paper-venue'>AAAI Conference on Artificial Intelligence (<strong>AAAI Oral</strong>), 2026</div>
    <div class='paper-links'>
      <a href="https://ojs.aaai.org/index.php/AAAI/article/download/40479/44440"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/Jderder/ChildBench"><i class="fab fa-github"></i> Code</a>
    </div>
  </div>
</div>

<span class='anchor' id='paper-gtasr'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">ICML</div>
      <img src='images/gtasr.png' alt="GTASR" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Joint Geometric and Trajectory Consistency Learning for One-Step Real-World Super-Resolution</div>
    <div class='paper-authors'>Chengyan Deng, <strong>Zhangquan Chen</strong>, Li Yu, Kai Zhang, Xue Zhou, Wang Zhang</div>
    <div class='paper-venue'>International Conference on Machine Learning (<strong>ICML</strong>), 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2602.24240"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/Blazedengcy/GTASR"><i class="fab fa-github"></i> Code</a>
    </div>
  </div>
</div>

<span class='anchor' id='paper-vif'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">ICLR</div>
      <img src='images/vif.png' alt="ViF" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Visual Multi-Agent System: Mitigating Hallucination Snowballing via Visual Flow</div>
    <div class='paper-authors'>Xinlei Yu, Chengming Xu, Guibin Zhang, Yongbo He, <strong>Zhangquan Chen</strong>, Zhucun Xue, Jiangning Zhang, Yue Liao, Xiaobin Hu, Yu-Gang Jiang, Shuicheng Yan</div>
    <div class='paper-venue'>International Conference on Learning Representations (<strong>ICLR</strong>), 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2509.21789"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/YU-deep/ViF"><i class="fab fa-github"></i> Code</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/calmars.png' alt="CALMARS" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Adversarial Robustness for Unified Multi-Modal Encoders via Efficient Calibration</div>
    <div class='paper-authors'>Chih-Ting Liao, <strong>Zhangquan Chen</strong>, Chunlei Meng, Tzu-Yu Huang, Xin Cao, Xu Zheng</div>
    <div class='paper-venue'>arXiv 2025</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2505.11895"><i class="fas fa-file-pdf"></i> Paper</a>
    </div>
  </div>
</div>

<span class='anchor' id='paper-mact'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">CVPR</div>
      <img src='images/visualdoc.png' alt="MACT" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Visual Document Understanding and Reasoning: A Multi-Agent Collaboration Framework with Agent-Wise Adaptive Test-Time Scaling</div>
    <div class='paper-authors'>Xinlei Yu, Chengming Xu, <strong>Zhangquan Chen</strong>, Yudong Zhang, Shilin Lu, Cheng Yang, Jiangning Zhang, Shuicheng Yan, Xiaobin Hu</div>
    <div class='paper-venue'>Computer Vision and Pattern Recognition (<strong>CVPR Highlight</strong>), 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2508.03404"><i class="fas fa-file-pdf"></i> Paper</a>
    </div>
  </div>
</div>

<span class='anchor' id='paper-reasoning-vla'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">ICML</div>
      <img src='images/reasonvla.png' alt="Reasoning-VLA" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Reasoning-VLA: A Fast and General Vision-Language-Action Reasoning 
    Model for Autonomous Driving</div>
    <div class='paper-authors'>Dapeng Zhang, Zhenlong Yuan, <strong>Zhangquan Chen</strong>, Chih-Ting Liao, Yinda Chen, Fei Shen, Qingguo Zhou, Tat-Seng Chua</div>
    <div class='paper-venue'>International Conference on Machine Learning (<strong>ICML</strong>), 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2511.19912"><i class="fas fa-file-pdf"></i> Paper</a>
    </div>
  </div>
</div>

<span class='anchor' id='paper-l2-vmas'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">ICML</div>
      <img src='images/dualagent.png' alt="L²-VMAS" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Dual Latent Memory for Visual Multi-agent System</div>
    <div class='paper-authors'>Xinlei Yu, Chengming Xu, <strong>Zhangquan Chen</strong>, Bo Yin, Cheng Yang, Yongbo He, Yihao Hu, Jiangning Zhang, Cheng Tan, Xiaobin Hu, Shuicheng Yan</div>
    <div class='paper-venue'>International Conference on Machine Learning (<strong>ICML</strong>), 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2602.00471"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/YU-deep/L2-VMAS"><i class="fab fa-github"></i> Code</a>
    </div>
  </div>
</div>

<span class='anchor' id='paper-spamem'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">ECCV</div>
      <img src='images/spamem.png' alt="SpaMEM" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>SpaMEM: Benchmarking Dynamic Spatial Reasoning via Perception-Memory Integration in Embodied Environments</div>
    <div class='paper-authors'>Chih-Ting Liao, Xi Xiao, Chunlei Meng, <strong>Zhangquan Chen</strong>, Yitong Qiao, Weilin Zhou, Tianyang Wang, Xu Zheng, Xin Cao</div>
    <div class='paper-venue'>European Conference on Computer Vision (<strong>ECCV</strong>), 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2604.22409"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/datasets/mill-ct-liao/SpaMEM"><i class="fas fa-database"></i> Dataset</a>
    </div>
  </div>
</div>

<span class='anchor' id='paper-vismem'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">CVPR</div>
      <img src='images/vismem.png' alt="VisMem" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>VisMem: Latent Vision Memory Unlocks Potential of Vision-Language Models</div>
    <div class='paper-authors'>Xinlei Yu, Chengming Xu, Guibin Zhang, <strong>Zhangquan Chen</strong>, Yudong Zhang, Yongbo He, Peng-Tao Jiang, Jiangning Zhang, Xiaobin Hu, Shuicheng Yan</div>
    <div class='paper-venue'>Computer Vision and Pattern Recognition (<strong>CVPR</strong>), 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2511.11007"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/YU-deep/VisMem"><i class="fab fa-github"></i> Code</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/topology.png' alt="OmniZoo" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Topology-Agnostic Animal Motion Generation from Text Prompt</div>
    <div class='paper-authors'>Keyi Chen, Mingze Sun, Zhenyu Liu, <strong>Zhangquan Chen</strong>, Ruqi Huang</div>
    <div class='paper-venue'>arXiv 2025</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2512.10352"><i class="fas fa-file-pdf"></i> Paper</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/evofsm.png' alt="EvoFSM" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>EvoFSM: Controllable Self-Evolution for Deep Research with Finite State Machines</div>
    <div class='paper-authors'>Shuo Zhang, Chaofa Yuan, Ryan Guo, Xiaomin Yu, Rui Xu, <strong>Zhangquan Chen</strong>, Zinuo Li, Zhi Yang, Shuhao Guan, Zhenheng Tang, Sen Hu, Liwen Zhang, Ronghao Chen, Huacan Wang</div>
    <div class='paper-venue'>arXiv 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2601.09465"><i class="fas fa-file-pdf"></i> Paper</a>
    </div>
  </div>
</div>

<span class='anchor' id='paper-skillgenbench'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/skillbench.png' alt="SkillGenBench" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>SkillGenBench: Benchmarking Skill Generation Pipelines for LLM Agents</div>
    <div class='paper-authors'>Yifan Zhou, Zhentao Zhang, Ziming Cheng, Shuo Zhang, Qizhen Lan, <strong>Zhangquan Chen</strong>, Zhi Yang, Qianyu Xu, Ronghao Chen, Huacan Wang, Sen Hu</div>
    <div class='paper-venue'>arXiv 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2605.18693"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/QuantaAlpha/SkillGenBench"><i class="fab fa-github"></i> Code</a>
    </div>
  </div>
</div>

<span class='anchor' id='paper-worldmodel'></span>
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/mentalmap.png' alt="Do LLMs Build World Models From Text?" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Do LLMs Build World Models From Text? A Multilingual Diagnostic of Spatial Reasoning</div>
    <div class='paper-authors'>Zhikai Pan, Chih-Ting Liao, Chunrui Liu, Xi Xiao, Yitong Qiao, Chunlei Meng, <strong>Zhangquan Chen</strong>, Xin Cao</div>
    <div class='paper-venue'>arXiv 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2605.28277"><i class="fas fa-file-pdf"></i> Paper</a>
    </div>
  </div>
</div>

<span class='anchor' id='internships'></span>

# 💼 Internships

<div class="internship-logos">
  <!-- 每个 logo 独立调高度：改 inline style 里的两个 px 数字即可（建议 40–72px） -->
  <img src="images/msra.png"      alt="Microsoft Research Asia" style="height: 35px !important; max-height: 40px !important;">
  <img src="images/bytedance.png" alt="ByteDance"               style="height: 32px !important; max-height: 40px !important;">
  <img src="images/hunyuan.png"   alt="Tencent Hunyuan"         style="height: 40px !important; max-height: 40px !important;">
  <img src="images/longcat.png"   alt="Meituan LongCat"         style="height: 38px !important; max-height: 40px !important;">
  <img src="images/qq.png"        alt="QQ"                      style="height: 38px !important; max-height: 40px !important;">
  <img src="images/youtu.webp"    alt="Tencent YouTu Lab"       style="height: 70px !important; max-height: 70px !important;">
</div>

- **May 2026 – Present:** [Tencent](https://www.tencent.com/en-us/) · Research Intern (青云人才计划) · [YouTu Lab](https://youtu.qq.com/) · Shennong Research Center
- **Dec 2025 – Apr 2026:** [Tencent](https://www.tencent.com/en-us/) · Research Intern (青云人才计划) · [Hunyuan](https://hunyuan.tencent.com/) Multimodal LLM Group
- **Aug 2025 – Dec 2025:** [Meituan](https://www.meituan.com/) · Research Intern (北斗人才计划) · M17 LongCat Foundation Model Group
- **Apr 2025 – Aug 2025:** [ByteDance](https://www.bytedance.com/zh/) · Research Intern (筋斗云人才计划) · Multimodal LLM Content Understanding Group
- **Dec 2024 – Mar 2025:** [Microsoft Research Asia](https://www.microsoft.com/en-us/research/lab/microsoft-research-asia-zh-cn/) · Research Intern (Rising Star Award) · AI/ML Group
- **May 2024 – Aug 2024:** [Tencent](https://www.tencent.com/en-us/) · Research Intern · QQ Multimodal LLM Group
- **2022 – 2024:** [Beijing OneXOne Tech Co., Ltd.](https://shizhe.chat/) · Chief Technology Officer and Co-founder

<span class='anchor' id='honors-and-awards'></span>

# 🎖 Honors and Awards
### 🏅 Honor Recognitions
- **Sun Yat-sen University Outstanding Graduate**
- **Sun Yat-sen University Outstanding Graduation Thesis (Rank 1)**
- Sun Yat-sen University Outstanding Role Model
- Sun Yat-sen University Outstanding League Member (2020, 2021)
- Suzhou Innovation and Entrepreneurship Leading Talent
- Microsoft Research Asia Rising Star Award (Top 10%)

### 💰 Scholarship Awards
- **National Scholarship (2022)**
- Tsinghua University Scholarship (2025)
- Shanghai Institute of Organic Chemistry, CAS Scholarship (2020)
- Sun Yat-sen University Outstanding Undergraduate Scholarship (2020, 2021, 2022)
- Sun Yat-sen University Discipline Competition Scholarship

### 🏆 Academic Competitions
- **Outstanding Winner (<span style="color:red">1st globally, Top 0.03%</span>), 7th SW International College Mathematical Modeling Competition (2022)**
- **First Prize, National College Mathematical Modeling Competition (2020)**
- Second Prize, 12th National College Mathematics Competition (2020)
- Second Prize, Asia-Pacific Mathematical Modeling Competition (2021)
- Honorable Mention, American Mathematical Contest in Modeling (2021)
- Second Prize, National CYC Cup Mathematical Modeling Competition (2022)
- Third Prize, Programming Competition (2020)
- Merit Award, National Olympiad in Mathematics (2020)
- Merit Award, Electronic Design Competition (2020)

### ⭐ Talent Programs
- **Tencent Qingyun Top Talent Program (腾讯青云人才计划)**
- ByteDance Jindouyun Top Talent Program (字节筋斗云人才计划)
- Jingdong Top Young Technical Genius (TGT) Program (京东TGT人才计划)
- Meituan Beidou Top Talent Program（美团北斗人才计划）
- ModelBest "Ahead Four" Top Talent Program (面壁前进四人才计划)

<!-- - *2021.06*, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet. 
- *2021.03*, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet.  \| [\[video\]](https://github.com/) -->

<!-- # 💻 Internships
- *2019.05 - 2020.02*, [Lorem](https://github.com/), China. -->

<span class='anchor' id='services'></span>

# 💬 Services
**Reviewer:** ICML (silver reviewer), NeurIPS, AAAI, ECCV and other top-tier conferences/journals in computer vision and machine learning.

<span class='anchor' id='visitor-stats'></span>

# 📊 Visitor Statistics

{% include visitor-stats.html %}
