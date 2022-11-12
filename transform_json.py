import json
import glob
import os
from tqdm import tqdm

from typing import List, NamedTuple

from transformers import pipeline
import torch

cuda = torch.device('cuda')

summarizer = pipeline("summarization", model="facebook/bart-large-cnn", device=0)
# summarizer.tokenizer.truncation = True
translator = pipeline("translation", model="Helsinki-NLP/opus-mt-en-es", device=0)


class NewsItem(NamedTuple):
	text: str
	title: str
	uri: str
	category: str
	date: str
	topics: List[str]
	summary: str
	translatedSummary: str

def process(path:str) -> NewsItem:
	with open(path) as f:
		data = json.load(f)

	md = data['metadata']
	contents = data['sections'][0]['content']

	summary = summarizer(contents, max_length=200, min_length=30, do_sample=False, truncation=True)[0]['summary_text']
	translation = translator(summary)[0]['translation_text']

	return NewsItem(
		text=contents,
		title=md['title'],
		uri=md['uri'],
		category=md['category'],
		date=md['date'],
		topics=md['misc']['topics'].split(', '),
		summary=summary,
		translatedSummary=translation
	)

	

def process_dir(directory:str) -> List[NewsItem]:
	ret = []
	for file in tqdm(glob.glob(os.path.join(directory, "*.json")), desc="Processing items"):
		ret.append(process(file))

	return ret


if __name__ == "__main__":
	elements = process_dir("./new-clu-scrap")

	with open("out.json", 'w') as f:
		json.dump([e._asdict() for e in elements], f)
